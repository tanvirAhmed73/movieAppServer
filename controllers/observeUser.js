async function getobserverUser(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.name);
  } catch (err) {
    res.status(500).json({ message: "getObserverUser a error" });
  }
}

module.exports = { getobserverUser };
