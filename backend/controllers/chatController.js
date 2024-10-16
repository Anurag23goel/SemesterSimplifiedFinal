const { PrivateMessage } = require('../models/messagesModel'); // Assuming PrivateMessage is your Mongoose model

const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
//   console.log(user1, user2);
  

  try {
    // Query to fetch messages where either user1 sent a message to user2 or vice versa
    const messages = await PrivateMessage.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 }).populate('sender', 'name'); // Sorting by timestamp in ascending order

    

    // Return the fetched messages as a response
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { getMessages };
