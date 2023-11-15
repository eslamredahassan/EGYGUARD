const CustomChannel = require("../../../src/database/models/custom_voice");

module.exports = async (client, config) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
      const { guild, channel, member } = newState;

      switch (true) {
        case !channel || channel.id !== config.customVoice:
          // Handle other cases if needed
          return;

        case channel.id === config.customVoice:
          // Check if the user already has a custom channel
          const existingChannel = await CustomChannel.findOne({
            userId: member.id,
          });
          if (existingChannel) return; // User already has a custom channel

          // Create a new voice channel for the user
          const newChannel = await guild.channels.create(
            `🎮︱${member.user.username}'s Channel`,
            {
              type: "GUILD_VOICE",
              parent: channel.parentId, // You may customize this
              permissionOverwrites: [
                {
                  id: guild.roles.everyone,
                  deny: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "CONNECT",
                    "SPEAK",
                    "STREAM",
                    "USE_VAD",
                    "USE_EXTERNAL_EMOJIS",
                    "USE_EXTERNAL_STICKERS",
                    "USE_APPLICATION_COMMANDS",
                    "PRIORITY_SPEAKER",
                    "ADD_REACTIONS",
                    "EMBED_LINKS",
                  ],
                },
                {
                  id: member.user.id,
                  allow: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "CONNECT",
                    "SPEAK",
                    "STREAM",
                    "USE_VAD",
                    "USE_EXTERNAL_EMOJIS",
                    "USE_EXTERNAL_STICKERS",
                    "USE_APPLICATION_COMMANDS",
                    "PRIORITY_SPEAKER",
                    "ADD_REACTIONS",
                    "EMBED_LINKS",
                  ],
                },
                {
                  id: config.verifyRole,
                  allow: [
                    "SEND_MESSAGES",
                    "VIEW_CHANNEL",
                    "CONNECT",
                    "SPEAK",
                    "STREAM",
                    "USE_VAD",
                    "USE_EXTERNAL_EMOJIS",
                    "USE_EXTERNAL_STICKERS",
                    "USE_APPLICATION_COMMANDS",
                    "PRIORITY_SPEAKER",
                    "ADD_REACTIONS",
                    "EMBED_LINKS",
                  ],
                },
              ],
              userLimit: 6, // You can set a user limit if desired
            },
          );

          // Move the user to the new channel
          await member.voice.setChannel(newChannel);

          // Save the channel information to the database
          await CustomChannel.create({
            guildId: guild.id,
            userId: member.id,
            username: member.user.username,
            channelId: newChannel.id,
          });

          break;
      }
    } catch (error) {
      console.error("Error in voiceStateUpdate:", error.message);
    }
  });
};
