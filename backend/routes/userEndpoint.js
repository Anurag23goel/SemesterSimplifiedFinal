const express = require("express");

const router = express.Router();

const {
  loginUser,
  registerUser,
  getUserInfo,
  updateUser,
  getAllUsers,
  getAllConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  getAllRequests,
} = require("../controllers/userController.js");

const { authentication } = require("../middlewares/auth");

router.use(express.json());

router.get("/getConnections", authentication, getAllConnections);
router.get("/getAllUsers", authentication, getAllUsers);
router.get("/getInfo", authentication, getUserInfo);
router.get("/getConnections", authentication, getAllConnections);
router.get("/getAllRequests", authentication, getAllRequests);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/updateUser", authentication, updateUser);
router.post("/sendConnection", authentication, sendConnectionRequest);
router.post("/acceptRequest", authentication, acceptConnectionRequest);

module.exports = router;
