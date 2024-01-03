const express = require("express");

const UserModel = require("../models/user.models");
const auth = require("../middlewares/auth");
const router = express.Router();

const messageReplies = [
  { pattern: /^hi$/i, reply: "Hello! How can I help you?" },
  { pattern: /^hello$/i, reply: "Hi there! How can I assist you?" },
  { pattern: /help/i, reply: "Sure, I'm here to help. What can I do for you?" },
  // Add more patterns and corresponding replies here
  {
    pattern: /.*/,
    reply:
      "I'm sorry, I don't understand your message. Please contact us at test@gmail.com.",
  },
];

router.post("/reply", auth, async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    let reply = "I'm not sure how to respond to that.";

    // Find a matching pattern and get the corresponding reply
    for (const { pattern, reply: responseMessage } of messageReplies) {
      if (pattern.test(userMessage)) {
        reply = responseMessage;
        break;
      }
    }

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/greet", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    console.log(user);
    if (!user) {
      res.status(404).send({ message: "Not Found" });
    }
    res.status(200).json(`Hi ${user.name}! ,How can i help you? `);
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: err.message });
  }
});

module.exports = router;
