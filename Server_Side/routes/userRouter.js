const router = require("express").Router();
const { checkToken, getUserFromDb } = require("../middleware/auth");

const {
  login,
  createUser,
  logout,
  getCurrentUser,
} = require("../controllers/users");

router.get("/me", checkToken, getUserFromDb, getCurrentUser); //checked
router.post("/", login); //checked
router.post("/register", createUser); //checked
router.post("/logout", logout); //checked

module.exports = router;
