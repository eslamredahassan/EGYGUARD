const axios = require("axios");
const fs = require("fs");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));

module.exports = async (client, config) => {
  const API = cycleConfig.warframeAPI;
  const Channel = cycleConfig.WarframeCycle;

  const DAY_EMOJI = "☀️";
  const NIGHT_EMOJI = "🌙";

  async function updateCetusCycle() {
    try {
      const response = await axios.get(API.cetusAPI);

      const state = response.data.isDay ? "Day" : "Night";
      const timeLeftString = response.data.timeLeft;

      if (timeLeftString !== undefined) {
        const timeComponents = timeLeftString.match(/(\d+)m (\d+)s/);

        if (timeComponents) {
          const minutes = parseInt(timeComponents[1], 10);
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          let timeString = "";
          if (hours > 0) {
            timeString += `${hours}h `;
          }
          if (remainingMinutes > 0 || hours === 0) {
            timeString += `${remainingMinutes}m`;
          }

          const cetusCycle =
            state === "Day" ? `${DAY_EMOJI}︱Day` : `${NIGHT_EMOJI}︱Night`;

          const guild = client.guilds.cache.get(config.guildID);
          if (!guild) {
            console.log("Guild not found in cache.");
            return;
          }

          const channel = guild.channels.cache.get(Channel.cetus);
          if (channel && channel.type === "GUILD_VOICE") {
            await channel.setName(`${cetusCycle} ${timeString}`);
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Cetus Cycle:`,
              `\x1b[32m ${cetusCycle} ${timeString}`,
            );
          } else {
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Error in Cetus Cycle:`,
              `\x1b[32m Voice channel not found or invalid channel type.`,
            );
          }
        } else {
          console.log(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in Cetus Cycle:`,
            `\x1b[32m Time string format does not match expected pattern.`,
          );
        }
      } else {
        console.log(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in Cetus Cycle:`,
          `\x1b[32m Time left is undefined in the API response -`,
          `\x1b[32m ${response}`,
        );
      }
    } catch (error) {
      console.error(
        `\x1b[0m`,
        `\x1b[33m 〢`,
        `\x1b[33m ${moment(Date.now()).format("LT")}`,
        `\x1b[31m Error in Cetus Cycle:`,
        `\x1b[32m ${error.message}`,
      );
    }
  }

  setInterval(updateCetusCycle, 60 * 1000);
};
