const axios = require("axios");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const config = require("../../src/config.js");
const assest = JSON.parse(fs.readFileSync("./src/assest/assest.json"));
const emoji = assest.emoji;
const color = assest.color;

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "baro") return;

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
        const baroCycle = `${emoji.baro} Baro Ki'Teer`;

        if (interaction.channel && interaction.channel.type === "GUILD_TEXT") {
          const startTimeStamp = Math.floor(Date.parse(start) / 1000);
          const endTimeStamp = Math.floor(Date.parse(end) / 1000);

          const embed = new MessageEmbed()
            .setTitle(
              `${baroCycle} ${isActive ? "Arrived" : "Didin't Arrive Yet"}`,
            )
            .setImage("https://i.imgur.com/0KhYPrk.gif")
            .setColor(isActive ? color.gray : color.gray);

          if (isActive) {
            embed
              .setDescription(
                `## ${emoji.inventory} Inventory\n**${inventoryWithLinks.join(
                  "\n",
                )}**`,
              )
              .setFields([
                {
                  name: `${emoji.location} Leaves`,
                  value: `${emoji.mark} ${location}`,
                  inline: false,
                },
                {
                  name: `${emoji.arrived} Arrived`,
                  value: `${emoji.mark} <t:${startTimeStamp}:R>`,
                  inline: true,
                },
                {
                  name: `${emoji.leave} Leaves`,
                  value: `${emoji.mark} <t:${endTimeStamp}:R>`,
                  inline: true,
                },
              ])
              .setFooter({
                text:
                  client.user.username +
                  " ・ Powered by Warframe API and warframe.fandom.com",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              });
          } else {
            embed
              ///.setDescription(`### ${emoji.mark} Baro Ki'Teer didn't arrive yet` )
              .setFields([
                {
                  name: `${emoji.arrived} Arrive`,
                  value: `${emoji.mark} <t:${startTimeStamp}:R>`,
                  inline: true,
                },
                {
                  name: `${emoji.location} Location`,
                  value: `${emoji.mark} ${location}`,
                  inline: true,
                },
              ])
              .setFooter({
                text:
                  client.user.username +
                  " ・ Powered by Warframe API and warframe.fandom.com",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              });
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
