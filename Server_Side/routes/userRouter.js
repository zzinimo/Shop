const router = require("express").Router();
const { checkToken, getUserFromDb } = require("../middleware/auth");

const {
  login,
  createUser,
  logout,
  getCurrentUser,
} = require("../controllers/users");
const {
  createUserSchema,
  loginSchema,
  validateUser,
} = require("../validation/users");
//base enpoint = /login/

router.get("/me", checkToken, getUserFromDb, getCurrentUser); //checked
router.post("/", validateUser(loginSchema), login); //checked
router.post("/register", validateUser(createUserSchema), createUser); //checked
router.post("/logout", logout); //checked

module.exports = router;
