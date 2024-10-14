const express = require ('express');
const userRoute = require ("./userEndpoint.js");
const documentRoute = require("./fileEndpoint.js")

const router = express.Router();

router.use('/user',userRoute);
router.use('/documents', documentRoute)

module.exports = router;