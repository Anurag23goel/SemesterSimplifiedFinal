const express = require("express");
const router = express.Router();

const { getData, uploadFile, rateDocument, getDocumentByIdForRating} = require("../controllers/fileController");
const  {authentication}  = require("../middlewares/auth");

router.get("/search", getData);
router.post('/upload', authentication, uploadFile)
router.post('/:id/rate', authentication, rateDocument)
router.get('/:id', getDocumentByIdForRating)

module.exports = router;
