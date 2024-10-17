const SubjectMaterial = require("../models/subjectMaterialModel");
const User = require("../models/userModel");

const getData = async (req, res) => {
  const { course, subject } = req.query;

  if (!course || !subject) {
    return res.status(400).json({ message: "Course and subject are required" });
  }

  try {
    const data = await SubjectMaterial.find({ course, subject }).populate(
      "uploadedBy",
      "name"
    );

    const responseData = data.map((doc) => {
      return {
        ...doc.toObject(),
        uploadedBy: doc.uploadedBy.name, //Replace ObjectId with user name
      };
    });

    res.status(200).json(responseData); // Set proper status code
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const uploadFile = async (req, res) => {
  const { title, description, course, subject, category, university, url } =
    req.body;
  const userFromToken = req.user;

  if (!title || !description || !course || !subject || !url || !university) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newDoc = await SubjectMaterial.create({
      title,
      description,
      course,
      subject,
      category,
      uploadedBy: userFromToken.id,
      url,
      university,
    });

    await User.findByIdAndUpdate(
      userFromToken.id,
      { $push: { materialUploaded: newDoc._id } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "File information saved successfully!",
      data: newDoc,
    });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while saving the document.",
    });
  }
};

const rateDocument = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const userId = req.user.id; // Get authenticated user ID

  if (rating < 1 || rating > 5) {
    return res.status(400).send("Rating must be between 1 and 5");
  }

  try {
    const document = await SubjectMaterial.findById(id).populate(
      "ratings.user",
      "name"
    );
    if (!document) {
      return res.status(404).send("Document not found");
    }

    console.log(document);

    // Check if the user has already rated the document
    const existingRatingIndex = document.ratings.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingRatingIndex !== -1) {
      // Update the existing rating
      document.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add a new rating
      document.ratings.push({ user: userId, rating });
    }

    // Calculate the new average rating
    document.averageRating =
      document.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
      document.ratings.length;

    await document.save();

    res.status(200).json({
      averageRating: document.averageRating,
      ratingsCount: document.ratings.length,
    });
  } catch (error) {
    console.error("Error rating document:", error);
    res.status(500).send("Server error");
  }
};

const getDocumentByIdForRating = async (req, res) => {
  const { id } = req.params; // Get the document ID from the request parameters

  try {
    const document = await SubjectMaterial.findById(id)
      .populate("uploadedBy", "name") // Populate the uploadedBy field with user data
      .select("-__v"); // Exclude the __v field from the response (optional)

    if (!document) {
      return res.status(404).send("Document not found");
    }

    // Prepare the response data
    const responseData = {
      averageRating: document.averageRating || 0, // Default to 0 if no ratings exist
      ratings: document.ratings || [], // Include ratings for further processing if needed
      ratingsCount: document.ratings.length || 0, // Default to 0 if no ratings exist
    };

    res.status(200).json(responseData); // Send the document data in the response
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getData,
  uploadFile,
  rateDocument,
  getDocumentByIdForRating,
};
