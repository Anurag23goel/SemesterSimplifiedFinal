const express = require("express");
const router = express.Router();

const { getMessages } = require("../controllers/chatController");
const { authentication } = require("../middlewares/auth");

router.get("/private/:user1/:user2", authentication, getMessages);

module.exports = router;