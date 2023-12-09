const axios = require("axios");
const fs = require("fs");
const config = require("../../../src/config.js");

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;
const GUILD_ID = config.guildID;

const FASS_EMOJI = "💦"; // Adjust the emojis as needed
const VOME_EMOJI = "💥";

module.exports = async (client, config) => {
  async function updateCambionCycle() {
    try {
      const response = await axios.get(API.cambionAPI);
      const cambionState = response.data.active;
      const timeLeft = response.data.timeLeft || "Unknown";

      if (cambionState !== undefined) {
        const cambionCycle =
          cambionState === "fass"
            ? `${FASS_EMOJI}︱Fass`
            : `${VOME_EMOJI}︱Vome`;

        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
          console.log("Guild not found in cache.");
          return;
        }

        const channel = guild.channels.cache.get(Channel.cambion);
        if (channel && channel.type === "GUILD_VOICE") {
          await channel.setName(`${cambionCycle} ${timeLeft}`);
          console.log(
            `Updated voice channel name to Cambion Cycle: ${cambionCycle} ${timeLeft}`,
          );
        } else {
          console.log("Voice channel not found or invalid channel type.");
        }
      } else {
        console.log(
          "Cambion state is undefined in the API response:",
          response,
        );
      }
    } catch (error) {
      console.error("Error updating Cambion cycle:", error.message);
    }
  }

  setInterval(updateCambionCycle, 60 * 1000); // Update every minute
};
