const axios = require("axios");
const fs = require("fs");
const config = require("../../src/config.js");

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;

const GUILD_ID = config.guildID;
const WARM_EMOJI = "🔥";
const COLD_EMOJI = "❄️";

module.exports = async (client, config) => {
  async function updateVallisCycle() {
    try {
      const response = await axios.get(API.vallisAPI);
      const isWarm = response.data.isWarm;
      const timeLeft = response.data.timeLeft;

      if (timeLeft !== undefined) {
        const vallisCycle = isWarm
          ? `${WARM_EMOJI}︱Warm`
          : `${COLD_EMOJI}︱Cold`;

        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
          console.log("Guild not found in cache.");
          return;
        }

        const channel = guild.channels.cache.get(Channel.vallis);
        if (channel && channel.type === "GUILD_VOICE") {
          await channel.setName(`${vallisCycle} ${timeLeft}`);
          console.log(
            `Updated voice channel name to Vallis Cycle: ${vallisCycle}`,
          );
        } else {
          console.log("Voice channel not found or invalid channel type.");
        }
      } else {
        console.log(
          "Time left is undefined in the Vallis API response:",
          response,
        );
      }
    } catch (error) {
      console.error("Error updating Vallis cycle:", error.message);
    }
  }

  setInterval(updateVallisCycle, 60 * 1000); // Update every minute
};
