const axios = require("axios");
const fs = require("fs");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));

module.exports = async (client, config) => {
  const API = cycleConfig.warframeAPI;
  const Channel = cycleConfig.WarframeCycle;

  const WARM_EMOJI = "🔥";
  const COLD_EMOJI = "❄️";

  async function updateVallisCycle() {
    try {
      const response = await axios.get(API.vallisAPI);
      const isWarm = response.data.isWarm;
      const timeLeftString = response.data.timeLeft || "Unknown"; // Use shortString here

      if (timeLeftString !== undefined) {
        const timeComponents = timeLeftString.match(/(\d+)m (\d+)s/);

        if (timeComponents) {
          const minutes = parseInt(timeComponents[1], 10);
          //const seconds = parseInt(timeComponents[2], 10);

          let timeLeft = "";
          if (minutes > 0) {
            timeLeft += `${minutes}m`;
          }

          const vallisCycle = isWarm
            ? `${WARM_EMOJI}︱Warm`
            : `${COLD_EMOJI}︱Cold`;

          const guild = client.guilds.cache.get(config.guildID);
          if (!guild) {
            console.log("Guild not found in cache.");
            return;
          }

          const channel = guild.channels.cache.get(Channel.vallis);
          if (channel && channel.type === "GUILD_VOICE") {
            await channel.setName(`${vallisCycle} ${timeLeft}`);
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Vallis Cycle:`,
              `\x1b[32m ${vallisCycle} ${timeLeft}`,
            );
          } else {
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Error in Vallis Cycle:`,
              `\x1b[32m Voice channel not found or invalid channel type`,
            );
          }
        } else {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in Vallis Cycle:`,
            `\x1b[32m Time string format does not match expected pattern`,
          );
        }
      } else {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in Vallis Cycle -`,
          `\x1b[32m shortString is undefined in the Vallis API response:`,
          `\x1b[32m ${response}`,
        );
      }
    } catch (error) {
      console.error(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error in Vallis Cycle:`,
        `\x1b[32m ${error.message}`,
      );
    }
  }

  setInterval(updateVallisCycle, 60 * 1000); // Update every minute
};
