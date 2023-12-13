// Import necessary modules and dependencies
const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const ms = require("ms");

const emojis = require("../assest/emojis");
const color = require("../assest/color.js");

const Warning = require("../../src/database/models/warn");

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "warn") {
      // Check if the bot has the ADMINISTRATOR permission
      await interaction.deferReply({ ephemeral: true });

      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      // Check permissions (example: only allow moderators to warn)
      if (
        !interaction.member ||
        !interaction.member.roles.cache.some((role) => role.name === "STAFF 👮🏻")
      ) {
        return interaction.editReply({
          content: "You do not have permission to use this command.",
        });
      }

      // Check if the user has been warned before
      const existingWarning = await Warning.findOne({ userId: user.id });

      if (existingWarning) {
        // If the user has been warned before, show STAFF an embed with a select menu
        const warnActionsSelectMenu = new MessageSelectMenu()
          .setCustomId("actionSelect")
          .setPlaceholder("Choose an action...")
          .addOptions([
            {
              label: "Timeout",
              value: "timeout",
              description: "Apply a timeout.",
            },
            {
              label: "Kick",
              value: "kick",
              description: "Kick the user.",
            },
            {
              label: "Ban",
              value: "ban",
              description: "Ban the user.",
            },
          ]);

        const warnActionsRow = new MessageActionRow().addComponents(
          warnActionsSelectMenu,
        );

        const warnActionsEmbed = new MessageEmbed()
          .setColor(color.gray)
          .setTitle(`User ${user.tag} has a warning`)
          .setTimestamp();

        // Check if the reason is not an empty string before adding it to the embed
        if (existingWarning.reason.trim() !== "") {
          warnActionsEmbed.setDescription(`Reason: ${existingWarning.reason}`);
        }

        warnActionsEmbed.addFields({
          name: "Choose an action:",
          value: "Use the select menu to choose an action.",
        });

        // Respond with the embed and select menu
        interaction.editReply({
          embeds: [warnActionsEmbed],
          components: [warnActionsRow],
        });

        const collector = interaction.channel.createMessageComponentCollector({
          filter: (i) => i.isSelectMenu() && i.customId === "actionSelect",
          time: 30000, // Adjust the time as needed
        });

        collector.on("collect", async (selectInteraction) => {
          const targetUser = await interaction.guild.members.fetch(user);
          const { default: prettyMs } = await import("pretty-ms");
          const selectedAction = selectInteraction.values[0];
          const duration = ms("7d"); // Example: timeout for 7 days

          // Handle different actions
          switch (selectedAction) {
            case "timeout":
              await targetUser.timeout(duration, reason);
              await interaction.editReply({
                embeds: [
                  {
                    title: `${emojis.alert} Oops!`,
                    description: `${
                      emojis.threadMark
                    } ${targetUser} was timed out for ${prettyMs(duration, {
                      verbose: true,
                    })} for Reason: ${reason}`,
                    color: color.gray,
                  },
                ],
                //this is the important part
                ephemeral: true,
                components: [],
              });
              await Warning.deleteOne({ userId: user.id });
              break;

            case "kick":
              await user.kick(reason);
              interaction.editReply({
                content: `Successfully kicked ${user.tag}. Reason: ${reason}`,
                ephemeral: true,
                components: [],
              });
              await Warning.deleteOne({ userId: user.id });
              break;

            case "ban":
              // Implement ban logic here
              // Example: Ban the user from the server
              // Make sure to add appropriate checks and handle errors

              // Assuming the ban was successful, delete the warning from the database
              await Warning.deleteOne({ userId: user.id });
              break;

            default:
              break;
          }

          // You can also update the original reply to indicate that the action has been taken
          interaction.editReply({
            content: `User ${user.tag} has been ${selectedAction} for: ${reason}`,
            components: [], // Remove the select menu after an action is chosen
          });
        });

        collector.on("end", (collected, reason) => {
          // Cleanup after collector ends (e.g., remove select menu)
          // You can handle additional cleanup tasks here if needed
        });
      } else {
        // If the user has not been warned before, save the warning to the database
        const newWarning = new Warning({
          userId: user.id,
          moderatorId: interaction.user.id,
          reason: reason,
        });
        await newWarning.save();

        // Respond to the user
        interaction.editReply(
          `User ${user.tag} has been warned for: ${reason}`,
        );

        // Send a direct message to the warned user
        await user.send({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle("You have received a warning")
              .setDescription(`Reason: ${reason}`)
              .setTimestamp(),
          ],
        });
      }
    }
  });
};
