const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));

module.exports = async (client, config) => {
  const API = cycleConfig.warframeAPI;
  const Channel = cycleConfig.WarframeCycle;

  const DAY_EMOJI = "☀️";
  const NIGHT_EMOJI = "🌙";
  const mockResponse = {
    data: {
      id: "cetusCycle1702351800000",
      expiry: "2023-12-12T03:30:00.000Z",
      activation: "2023-12-12T01:50:00.000Z",
      isDay: true,
      state: "day",
      timeLeft: "1h 40m 4s",
      isCetus: true,
      shortString: "40m to Night",
    },
  };

  async function updateCetusCycle() {
    try {
      const response = await axios.get(API.cetusAPI);

      const state = response.data.isDay ? "Day" : "Night";
      const timeLeftString = response.data.timeLeft;

      if (timeLeftString !== undefined) {
        const timeComponents = timeLeftString.match(
          /(\d+h)? ?(\d+m)? ?(\d+s)?/,
        );

        if (timeComponents) {
          const hours = parseInt(timeComponents[1], 10) || 0;
          const minutes = parseInt(timeComponents[2], 10) || 0;
          const seconds = parseInt(timeComponents[3], 10) || 0;

          let timeString = "";
          if (hours > 0) {
            timeString += `${hours}h `;
          }

          if (minutes > 0 || hours > 0) {
            timeString += `${minutes}m`;
          }

          const cetusCycle =
            state === "Day" ? `${DAY_EMOJI}︱Day` : `${NIGHT_EMOJI}︱Night`;

          const finalString = `${cetusCycle} ${timeString}`;

          const guild = client.guilds.cache.get(config.guildID);
          if (!guild) {
            console.log("Guild not found in cache.");
            return;
          }

          const channel = guild.channels.cache.get(Channel.cetus);
          if (channel && channel.type === "GUILD_VOICE") {
            await channel.setName(finalString); // Set the channel name directly
            console.log(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Cetus Cycle`,
              `\x1b[32m ${finalString}`,
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
