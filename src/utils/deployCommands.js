const config = require("../config");
const moment = require("moment");

module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);
  if (guild) {
    try {
      await guild.commands.set([
        {
          name: "verification_setup",
          description: `[Dev] Launch setup menu to choose between open, close and developer modes`,
          type: "CHAT_INPUT",
          options: [
            {
              name: "channel",
              description: "Choose channel you want to send your message in",
              type: 7, // CHANNEL
              required: true,
            },
          ],
        },
        {
          name: "timeout",
          description: "Set a timeout for the channel",
          options: [
            {
              name: "user",
              description: "The user to be timed out.",
              type: 6, // User Type
              required: true,
            },
            {
              name: "duration",
              description: "Select the duration for the timeout",
              type: 3,
              choices: [
                {
                  name: "1 minute",
                  value: "60000",
                },
                {
                  name: "5 minutes",
                  value: "300000",
                },
                {
                  name: "10 minutes",
                  value: "600000",
                },
                {
                  name: "1 hour",
                  value: "3600000",
                },
                {
                  name: "1 week",
                  value: "10080000",
                },
              ],
              required: true,
            },
            {
              name: "reason",
              description: "The reason for the timeout.",
              type: 3, // String Type
              required: false,
              min_length: 1,
              max_length: 512,
            },
          ],
        },

        {
          name: "warn",
          description: "Warn a member",
          options: [
            {
              name: "user",
              description: "The user to warn him.",
              type: 6, // User Type
              required: true,
            },
            {
              name: "reason",
              description: "The reason for the warning.",
              type: 3, // String Type
              required: true,
              min_length: 1,
              max_length: 512,
            },
          ],
        },
        {
          name: "kick",
          description: "Kick member from the server",
          options: [
            {
              name: "user",
              description: "The user to be kicked.",
              type: 6, // User Type
              required: true,
            },
            {
              name: "reason",
              description: "The reason for the kick.",
              type: 3, // String Type
              required: false,
              min_length: 1,
              max_length: 512,
            },
          ],
        },
        {
          name: "ban",
          description: "Ban member from joining the server again",
          options: [
            {
              name: "user",
              description: "The user to be banned.",
              type: 6, // User Type
              required: true,
            },
            {
              name: "reason",
              description: "The reason for the ban.",
              type: 3, // String Type
              required: false,
              min_length: 1,
              max_length: 512,
            },
          ],
        },
        {
          name: "unban",
          description: "revoke ban member that banned from the server",
          options: [
            {
              name: "user",
              description: "The user to be revoke his banned.",
              type: 6, // User Type
              required: true,
              autocomplete: true,
            },
            {
              name: "reason",
              description: "The reason for the revoke.",
              type: 3, // String Type
              required: false,
              min_length: 1,
              max_length: 512,
            },
          ],
        },
        {
          name: "purge",
          description: "Delete amount of messages",
          options: [
            {
              name: "amount",
              description: "Type the amount in number ( min: 1 max: 100 )",
              type: 4, // Integer Type
              required: true,
              min_length: 1,
              max_length: 512,
            },
          ],
        },
        {
          name: "status",
          description: `[Dev] Check EGYGUARD Uptime`,
          type: "CHAT_INPUT",
        },
        {
          name: "ping",
          description: `[Dev] Check EGYGUARD latency`,
          type: "CHAT_INPUT",
        },
        {
          name: "echo",
          description: `[Dev] EGYGUARD will send your message`,
          options: [
            {
              name: "channel",
              description: "Choose channel you want to send your message in",
              type: 7, // CHANNEL
              required: true,
            },
            {
              name: "message",
              description: "Type your echo message",
              type: 3, // STRING
              required: true,
              min_length: 2,
              max_length: 1000,
            },
          ],
        },
        {
          name: "world_cycle",
          description: `[Dev] EGYGUARD will send your message`,
          options: [
            {
              name: "channel",
              description: "Choose channel you want to send your message in",
              type: 7, // CHANNEL
              required: true,
            },
          ],
        },
        {
          name: "baro",
          description: `Check when baro ki'teer will be available`,
          type: "CHAT_INPUT",
        },
      ]);
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Slash Commands`,
        `\x1b[32m DEPLOYED`,
      );
    } catch (error) {
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Slash Commands`,
        `\x1b[323m ERROR: ${error.message}`,
      );
    }
  }
};
