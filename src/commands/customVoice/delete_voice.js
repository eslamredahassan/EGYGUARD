const CustomChannel = require("../../../src/database/models/custom_voice");

module.exports = async (client, config) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
      const { guild, member } = newState;

      switch (true) {
        case oldState.channelId && !newState.channelId:
          // Check if the user left a voice channel
          // Find and delete the user's custom channel
          const userChannel = await CustomChannel.findOneAndDelete({
            userId: member.id,
          });

          if (userChannel) {
            const channelToDelete = guild.channels.cache.get(
              userChannel.channelId,
            );

            // Check if the channel is empty periodically
            const interval = setInterval(() => {
              if (channelToDelete && channelToDelete.members.size === 0) {
                channelToDelete.delete();
                clearInterval(interval); // Stop checking once the channel is deleted
              }
            }, 1000); // Adjust the interval (in milliseconds) based on your requirements
          }
          break;

        // Add other cases as needed

        default:
          // Handle default case or other cases if needed
          break;
      }
    } catch (error) {
      console.error("Error in voiceStateUpdate:", error.message);
    }
  });
};
