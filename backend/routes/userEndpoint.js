const express = require("express");

const router = express.Router();

const { loginUser, registerUser, getUserInfo, updateUser, getAllUsers } = require("../controllers/userController.js");
const  {authentication}  = require("../middlewares/auth");


router.use(express.json());

router.get('/getUsers', authentication, getAllUsers)
router.get('/getInfo', authentication, getUserInfo)
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post('/updateUser', authentication, updateUser)

module.exports = router;
