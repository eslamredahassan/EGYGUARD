// Import necessary modules and dependencies
const { Permissions } = require("discord.js");

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName == "unban") {
      // Check if the bot has the ADMINISTRATOR permission

      await interaction.deferReply({ ephemeral: true });
      const userId = interaction.options.getUser("user");
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

      const bans = await interaction.guild.bans.fetch();
      const bannedUser = bans.find((ban) => ban.user.id === userId);

      if (!bannedUser) {
        return interaction.editReply({
          content: "User not found in the ban list.",
          ephemeral: true,
        });
      }

      try {
        await interaction.guild.members.unban(bannedUser.user, reason);
        interaction.editReply({
          content: `Successfully unbanned ${bannedUser.user.tag}. Reason: ${reason}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error unbanning user:", error.message);
        interaction.editReply({
          content: `Error unbanning user: ${error.message}`,
          ephemeral: true,
        });
      }
    }
  });
};
