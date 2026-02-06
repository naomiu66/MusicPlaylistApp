const User = require("../models/User");

const createUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};

const getUsers = async (params) => {
  let { page = 1, limit = 30, search = "" } = params;

  page = Math.max(Number(page), 1);
  limit = Math.max(Number(limit), 1);

  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("name createdAt")
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items: users,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUser = async (id, name, email, password) => {
  return await User.findByIdAndUpdate(
    id,
    { name, email, password, updatedAt: Date.now() },
    { new: true },
  );
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
