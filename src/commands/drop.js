const axios = require("axios");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const config = require("../../src/config.js");
const assest = JSON.parse(fs.readFileSync("./src/assest/assest.json"));
const emoji = assest.emoji;
const color = assest.color;

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;

module.exports = async (client, config) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "drop") {
      // Extract the search query from the interaction options
      const query = interaction.options.getString("item");

      if (!query) {
        return interaction.reply("Please provide a search query.");
      }

      try {
        // Make a request to the Warframe Drops API
        const response = await axios.get(
          `https://api.warframestat.us/items/${encodeURIComponent(query)}`,
        );
        const itemData = response.data;

        // Create and send an embed with the drop information
        const embed = new MessageEmbed().setColor(color.blue);

        if (itemData.category === "Relics") {
          // If the item is a Relic, display its rewards
          embed.setTitle(`Drops for ${query} (Relic)`);
          if (itemData.rewards && itemData.rewards.length > 0) {
            const rewardsList = itemData.rewards.map((reward) => {
              return `**${reward.rarity}:** ${reward.item.name}`;
            });
            embed.setDescription(rewardsList.join("\n"));
          } else {
            embed.setDescription("No rewards found for the specified Relic.");
          }
        } else {
          // If the item is not a Relic, handle it as usual
          embed.setTitle(`Drops for ${query}`);
          // Group drops by location
          // ... (your existing logic for handling other types of items)
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error("Error fetching drops:", error.message);
        interaction.reply("Error fetching drops. Please try again later.");
      }
    }
  });
};
