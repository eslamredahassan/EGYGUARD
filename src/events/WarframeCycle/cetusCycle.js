const axios = require("axios");
const fs = require("fs");
const config = require("../../src/config.js");

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;

const GUILD_ID = config.guildID;
const DAY_EMOJI = "☀️";
const NIGHT_EMOJI = "🌙";

module.exports = async (client, config) => {
  async function updateCetusCycle() {
    try {
      const response = await axios.get(API.cetusAPI);
      const state = response.data.isDay ? "Day" : "Night";
      const timeLeft = response.data.timeLeft;

      if (timeLeft !== undefined) {
        const cetusCycle =
          state === "Day" ? `${DAY_EMOJI}︱Day` : `${NIGHT_EMOJI}︱Night`;

        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
          console.log("Guild not found in cache.");
          return;
        }

        const channel = guild.channels.cache.get(Channel.cetus);
        if (channel && channel.type === "GUILD_VOICE") {
          await channel.setName(`${cetusCycle} ${timeLeft}`);
          console.log(
            `Updated voice channel name to Cetus Cycle: ${cetusCycle}`,
          );
        } else {
          console.log("Voice channel not found or invalid channel type.");
        }
      } else {
        console.log("Time left is undefined in the API response:", response);
      }
    } catch (error) {
      console.error("Error updating Cetus cycle:", error.message);
    }
  }

  setInterval(updateCetusCycle, 60 * 1000);
};
