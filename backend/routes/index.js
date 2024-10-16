const express = require ('express');
const userRoute = require ("./userEndpoint.js");
const documentRoute = require("./fileEndpoint.js")
const chatRoute = require("./chatEndpoint.js")

const router = express.Router();

router.use('/user',userRoute);
router.use('/documents', documentRoute);
router.use('/chat', chatRoute);

module.exports = router;