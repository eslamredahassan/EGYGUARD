const axios = require("axios");
const fs = require("fs");
const config = require("../../src/config.js");

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;
const GUILD_ID = config.guildID;

const BARO_EMOJI = "🛒"; // Adjust the emoji as needed

module.exports = async (client, config) => {
  async function updateBaroKiTeer() {
    try {
      const response = await axios.get(API.baroAPI);
      const isAvailable = response.data.active;
      const location = response.data.location || "Unknown";
      const inventory = response.data.inventory || [];

      const guild = client.guilds.cache.get(GUILD_ID);
      if (!guild) {
        console.log("Guild not found in cache.");
        return;
      }

      const channel = guild.channels.cache.get(Channel.baro);

      if (isAvailable !== undefined) {
        const baroStatus = isAvailable ? "Available" : "Not Available";
        const baroCycle = `${BARO_EMOJI}︱Baro Ki'Teer`;

        if (channel && channel.type === "GUILD_TEXT") {
          if (isAvailable) {
            const message = `**${baroCycle} ${baroStatus} - ${location}**\n\nBaro Ki'Teer has arrived! Check out his inventory:\n${formatInventory(
              inventory,
            )}`;
            channel.send(message);
          }
          await channel.setName(`${baroCycle} ${baroStatus} - ${location}`);
          console.log(
            `Updated voice channel name to Baro Ki'Teer: ${baroCycle} ${baroStatus} - ${location}`,
          );
        } else {
          console.log("Text channel not found or invalid channel type.");
        }
      } else {
        console.log(
          "Baro Ki'Teer status is undefined in the API response:",
          response,
        );
      }
    } catch (error) {
      console.error("Error updating Baro Ki'Teer status:", error.message);
    }
  }

  function formatInventory(inventory) {
    if (!inventory || inventory.length === 0) {
      return "No items available.";
    }

    return inventory.map((item) => `- ${item}`).join("\n");
  }

  setInterval(updateBaroKiTeer, 60 * 1000); // Update every minute
};
