const User = require("../models/User");
const CacheService = require("./cacheService");
const TTL = 60 * 15;

const usersCacheService = new CacheService("users:", TTL);

const createUser = async (name, email, password) => {
  const user = await User.create({ name, email, password });
  await usersCacheService.invalidateForNamespace("getUsers");
  return user;
};

const getUsers = async (params) => {
  let { page = 1, limit = 30, search = "" } = params;

  page = Math.max(Number(page), 1);
  limit = Math.max(Number(limit), 1);

  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  const cacheParams = {
    page,
    limit,
    search,
  };

  const cachedData = await usersCacheService.get("getUsers", cacheParams);
  if (cachedData) return cachedData;

  const [users, total] = await Promise.all([
    User.find(filter).select("name createdAt").skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  const data = {
    items: users,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  await usersCacheService.set("getUsers", cacheParams, data);

  return data;
};

const getUserById = async (id) => {
  const cacheParams = { id };
  const cachedData = await usersCacheService.get("getUserById", cacheParams);
  if (cachedData) return cachedData;

  const user = await User.findById(id);
  if (user) usersCacheService.set("getUserById", cacheParams, user);

  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const updateUser = async (id, name, email, password) => {
  const user = await User.findByIdAndUpdate(
    id,
    { name, email, password, updatedAt: Date.now() },
    { new: true },
  );

  if (user) {
    await usersCacheService.invalidateForNamespace("getUsers");
    await usersCacheService.invalidate("getUserById", { id });
  }
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (user) {
    await usersCacheService.invalidateForNamespace("getUsers");
    await usersCacheService.invalidate("getUserById", { id });
  }
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
