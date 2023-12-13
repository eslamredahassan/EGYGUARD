// Import necessary modules and dependencies
const { Permissions } = require("discord.js");

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "purge") {
      // Check if the bot has the ADMINISTRATOR permission

      await interaction.deferReply({ ephemeral: true });
      if (!guild.members.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return interaction.editReply({
          content: "I don't have the MANAGE_MESSAGES permission!",
          ephemeral: true,
        });
      }

      const amount = options.getInteger("amount");

      // Check if the amount is within a reasonable range
      if (amount < 1 || amount > 100) {
        return interaction.editReply({
          content: "Please provide a purge amount between 1 and 100.",
          ephemeral: true,
        });
      }

      // Delete the specified amount of messages
      try {
        const messages = await interaction.channel.bulkDelete(amount);

        // Reply to the interaction with a summary
        interaction.editReply({
          content: `Purged ${messages.size} messages.`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error purging messages:", error.message);
        interaction.editReply({
          content: `Error purging messages: ${error.message}`,
          ephemeral: true,
        });
      }
    }
  });
};
