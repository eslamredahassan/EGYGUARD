// Import necessary modules and dependencies
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageAttachment,
  Permissions,
} = require("discord.js");
const ms = require("ms");

const color = require("../assest/color.js");
const emoji = require("../assest/emojis");

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === "timeout") {
      //const user = guild.members.cache.get(options.getUser("user").id);
      const user = options.getUser("user");
      const duration = options.getString("duration");
      const reason = options.getString("reason") || "No reason provided";

      // Check if the bot has the TIMEOUT_MEMBERS permission
      if (!guild.members.me.permissions.has(Permissions.FLAGS.TIMEOUT_MEMBERS)) {
        return interaction.editReply({ content:
          "I don't have the TIMEOUT_MEMBERS permission!",
          ephemeral: true
        });
      }
      await interaction.deferReply();

      const targetUser = await interaction.guild.members.fetch(user);
      if (!targetUser) {
        await interaction.editReply({ content: "That user doesn't exist in this server.", ephemeral: true});
        return;
      }

      if (targetUser.user.bot) {
        await interaction.editReply({ content: "I can't timeout a bot.", ephemeral: true});
        return;
      }

      const msDuration = ms(duration);
      if (isNaN(msDuration)) {
        await interaction.editReply({ content: "Please provide a valid timeout duration.", ephemeral: true});
        return;
      }

      if (msDuration < 5000 || msDuration > 2.419e9) {
        await interaction.editReply({ content:
          "Timeout duration cannot be less than 5 seconds or more than 28 days.", ephemeral: true
        });
        return;
      }

      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
      const botRolePosition =
        interaction.guild.members.me.roles.highest.position; // Highest role of the bot

      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply({ content:
          "You can't timeout that user because they have the same/higher role than you.", ephemeral: true,
        });
        return;
      }

      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply({ content:
          "I can't timeout that user because they have the same/higher role than me.",
          ephemeral: true});
        return;
      }

      // Add the timeout
      try {
        const { default: prettyMs } = await import("pretty-ms");

        if (targetUser.isCommunicationDisabled()) {
          await targetUser.timeout(msDuration, reason);
          await interaction.editReply({ content:
            `${targetUser}'s timeout has been updated to ${prettyMs(
              msDuration,
              { verbose: true },
            )}\nReason: ${reason}`,
            ephemeral: true
          });
          return;
        }

        await targetUser.timeout(msDuration, reason);
        await interaction.editReply({ content: 
          `${targetUser} was timed out for ${prettyMs(msDuration, {
            verbose: true,
          })}. Reason: ${reason}`,
          ephemeral: true
        });
      } catch (error) {
        console.error("Error applying timeout:", error.message);
        interaction.reply({ content: 
          "Error applying timeout. Please check the duration and try again.",
          ephemeral: true
        });
      }
    }
  });
};
