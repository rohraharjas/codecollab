const { Router } = require("express");
const router = Router();
const { register, login, logout } = require("../controllers/auth_controller");

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

module.exports = router;