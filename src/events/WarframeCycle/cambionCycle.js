const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));

module.exports = async (client, config) => {
  const API = cycleConfig.warframeAPI;
  const Channel = cycleConfig.WarframeCycle;

  const FASS_EMOJI = "💦"; // Adjust the emojis as needed
  const VOME_EMOJI = "💥";

  async function updateCambionCycle() {
    try {
      const response = await axios.get(API.cambionAPI);
      const cambionState = response.data.active;
      const timeLeftString = response.data.timeLeft || "Unknown";

      if (cambionState !== undefined) {
        const timeComponents = timeLeftString.match(/(\d+)m (\d+)s/);

        if (timeComponents) {
          const minutes = parseInt(timeComponents[1], 10);
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          let timeLeft = "";
          if (hours > 0) {
            timeLeft += `${hours}h `;
          }
          if (remainingMinutes > 0 || hours > 0) {
            timeLeft += `${remainingMinutes}m`;
          }

          const cambionCycle =
            cambionState === "fass"
              ? `${FASS_EMOJI}︱Fass`
              : `${VOME_EMOJI}︱Vome`;

          const guild = client.guilds.cache.get(config.guildID);
          if (!guild) {
            console.log("Guild not found in cache.");
            return;
          }

          const channel = guild.channels.cache.get(Channel.cambion);
          if (channel && channel.type === "GUILD_VOICE") {
            await channel.setName(`${cambionCycle} ${timeLeft}`);
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Cambion Cycle`,
              `\x1b[32m ${cambionCycle} ${timeLeft}`,
            );
          } else {
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Error in Cambion Cycle:`,
              `\x1b[32m Voice channel not found or invalid channel type`,
            );
          }
        } else {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in Cambion Cycle:`,
            `\x1b[32m Time string format does not match expected pattern`,
          );
        }
      } else {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in Cambion Cycle -`,
          `\x1b[32m API response does not contain required data`,
          `\x1b[33m ${response}`,
        );
      }
    } catch (error) {
      console.log(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error in Cambion Cycle:`,
        `\x1b[32m ${error.message}`,
      );
    }
  }

  setInterval(updateCambionCycle, 30 * 1000); // Update every minute
};
