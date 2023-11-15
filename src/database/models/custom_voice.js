const mongoose = require("mongoose");

// Define the schema for the CustomChannel model
const CustomChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  channelId: { type: String, required: true },
});

// Create the VoiceChannel model
const CustomChannel = mongoose.model("CustomChannel", CustomChannelSchema);

module.exports = CustomChannel;
