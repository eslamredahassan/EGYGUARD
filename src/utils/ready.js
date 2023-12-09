const moment = require("moment");
const axios = require("axios"); // Make sure to install axios using npm install axios
const fs = require("fs");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;

module.exports = async (client, config) => {
  async function getWarframeCetus() {
    try {
      const response = await axios.get(API.cetusAPI);
      const { state, timeLeft, shortString } = response.data;

      // Use ☀️ for day and 🌙 for night
      const stateEmoji = state === "day" ? "Night" : "🌙";
      return `Cetus ${stateEmoji} in ${timeLeft}`;
    } catch (error) {
      console.error("Error fetching Warframe world time:", error);
      return "Unknown";
    }
  }
  async function getVallisCycle() {
    try {
      const response = await axios.get(API.vallisAPI);
      const { state, timeLeft, shortString } = response.data;

      // Use ☀️ for warm and ❄ for cold
      const stateEmoji = state === "warm" ? "☀️" : "❄️";
      return `Orb Vallis ${stateEmoji} for ${timeLeft}`;
    } catch (error) {
      console.error("Error fetching Warframe world time:", error);
      return "Unknown";
    }
  }

  async function getCambionCycle() {
    try {
      const response = await axios.get(API.cambionAPI);
      const { state, timeLeft, shortString } = response.data;

      // Use ☀️ for warm and ❄ for cold
      const stateEmoji = state === "warm" ? "💥" : "💦";
      return `Cambion ${stateEmoji} for ${timeLeft}`;
    } catch (error) {
      console.error("Error fetching Warframe world time:", error);
      return "Unknown";
    }
  }
  let membersCount = client.guilds.cache
    .map((guild) => guild.memberCount)
    .reduce((a, b) => a + b, 0);

  async function pickPresence() {
    const cetusCycle = await getWarframeCetus();
    const vallisCycle = await getVallisCycle();
    const cambionCycle = await getCambionCycle();

    const statusArray = [
      {
        type: "WATCHING",
        content: `${cetusCycle}`,
        status: "idle",
      },
      {
        type: "WATCHING",
        content: `${vallisCycle}`,
        status: "idle",
      },
      {
        type: "WATCHING",
        content: `${cambionCycle}`,
        status: "idle",
      },
    ];

    const option = Math.floor(Math.random() * statusArray.length);
    try {
      await client.user.setPresence({
        activities: [
          {
            name: statusArray[option].content,
            type: statusArray[option].type,
            url: statusArray[option].url,
          },
        ],
        status: statusArray[option].status,
      });
    } catch (error) {
      console.error(error);
    }
  }

  setInterval(pickPresence, 10000);

  console.log(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m EGYGUARD Activity`,
    `\x1b[32m UPDATED`,
  );
};
