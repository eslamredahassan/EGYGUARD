const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;

module.exports = async (client, config) => {
  async function getWarframeCetus() {
    try {
      const response = await axios.get(API.cetusAPI);
      const { state, timeLeft, shortString } = response.data;

      // Use ☀️ for day and 🌙 for night
      const stateEmoji = state === "day" ? "☀️" : "🌙";
      const formattedTimeLeft = timeLeft.replace(/\d+s$/, ""); // Remove seconds
      return `${stateEmoji}${formattedTimeLeft}`;
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
      const formattedTimeLeft = timeLeft.replace(/\d+s$/, ""); // Remove seconds
      return `${stateEmoji}${formattedTimeLeft}`;
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
      const formattedTimeLeft = timeLeft.replace(/\d+s$/, ""); // Remove seconds
      return `${stateEmoji}${formattedTimeLeft}`;
    } catch (error) {
      console.error("Error fetching Warframe world time:", error);
      return "Unknown";
    }
  }

  async function pickPresence() {
    const cetusCycle = await getWarframeCetus();
    const vallisCycle = await getVallisCycle();
    const cambionCycle = await getCambionCycle();

    const presenceString = `${cetusCycle} • ${vallisCycle} • ${cambionCycle}`;

    try {
      await client.user.setPresence({
        activities: [
          {
            name: presenceString,
            type: "WATCHING",
          },
        ],
        status: "idle",
      });
    } catch (error) {
      console.error(error);
    }
  }

  setInterval(pickPresence, 10 * 1000); // Update every minute

  console.log(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m EGYGUARD Activity`,
    `\x1b[32m UPDATED`,
  );
};
