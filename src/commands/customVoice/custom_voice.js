const CustomChannel = require("../../../src/database/models/custom_voice");

const moment = require("moment");

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
            `🎮︱${member.user.username}'s Team`,
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
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m ${member.user.username}`,
            `\x1b[32m CREATED`,
            `\x1b[33m 🎮  ︱${member.user.username}'s Team`,
          );

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
