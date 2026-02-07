const usersService = require("../services/usersService");

const getProfile = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.userId);

    if (!user) return res.status(404).json({ message: "Not Found" });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("Failed to fetch user profile", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOtherProfile = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("Failed to fetch user profile", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const params = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
    }
    const data = await usersService.getUsers(params);
    return res.json(data);
  } catch (err) {
    console.error("Failed to fetch users");
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  getOtherProfile,
  getUsers
};
