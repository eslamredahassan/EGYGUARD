const axios = require("axios");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const config = require("../../src/config.js");
const assest = JSON.parse(fs.readFileSync("./src/assest/assest.json"));
const emoji = assest.emoji;

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() && interaction.commandName !== "baro") return;

    await updateBaroKiTeer(interaction);
  });

  async function updateBaroKiTeer(interaction) {
    try {
      const response = await axios.get(API.baroAPI);
      const isActive = response.data.active;

      if (isActive !== undefined) {
        const location = response.data.location || "Unknown";
        const inventory = response.data.inventory || [];
        const start = response.data.activation || "Unknown";
        const end = response.data.expiry || "Unknown";
        const baroCycle = `${emoji.ducat} Baro Ki'Teer`;

        if (interaction.channel && interaction.channel.type === "GUILD_TEXT") {
          const embed = new MessageEmbed()
            .setTitle(
              `${baroCycle} ${isActive ? "Available" : "Not Available"}`,
            )
            .setImage("https://i.imgur.com/0KhYPrk.gif")
            .setColor(isActive ? "#00ff00" : "#ff0000");

          if (isActive) {
            embed.setDescription(
              `${
                emoji.ducat
              } Baro Ki'Teer has arrived! Check out his inventory:\n${formatInventory(
                inventory,
              )}\n\n**Start Time:** ${start}\n**End Time:** ${end}`,
            );
          } else {
            const startTimeStamp = Date.parse(start);
            embed.setDescription(
              `### Baro Ki'Teer is currently not available\n**He will be available <t:${Math.floor(
                startTimeStamp / 1000,
              )}:R> in ${location}.**`,
            );
          }

          interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          console.log("Text channel not found or invalid channel type.");
          await interaction.reply({
            content: "Error updating Baro Ki'Teer status.",
            ephemeral: true,
          });
        }
      } else {
        console.log(
          "Baro Ki'Teer status is undefined in the API response:",
          response,
        );
        await interaction.reply("Error updating Baro Ki'Teer status.");
      }
    } catch (error) {
      console.error("Error updating Baro Ki'Teer status:", error.message);
      await interaction.reply("Error updating Baro Ki'Teer status.");
    }
  }

  function formatInventory(inventory) {
    if (!inventory || inventory.length === 0) {
      return "No items available.";
    }

    return inventory.map((item) => `- ${item}`).join("\n");
  }
};
