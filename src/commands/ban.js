// Import necessary modules and dependencies
const { Permissions } = require("discord.js");

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === "ban") {
      // Check if the bot has the ADMINISTRATOR permission

      await interaction.deferReply({ ephemeral: true });

      const user = interaction.options.getUser("user");
      const reason =
        interaction.options.getString("reason") || "No reason provided";

      if (
        !interaction.guild.members.me.permissions.has(
          Permissions.FLAGS.BAN_MEMBERS,
        )
      ) {
        return interaction.editReply(
          "I don't have the BAN_MEMBERS permission!",
        );
      }

      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        return interaction.editReply({
          content: "User not found in this server.",
          ephemeral: true,
        });
      }

      if (!member.bannable) {
        return interaction.editReply({
          content: "I cannot ban this user.",
          ephemeral: true,
        });
      }

      try {
        await member.ban({ reason });
        interaction.editReply({
          content: `Successfully banned ${user.tag}. Reason: ${reason}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error banning user:", error.message);
        interaction.editReply({
          content: `"Error banning user: ${error.message}`,
          ephemeral: true,
        });
      }
    }
  });
};
