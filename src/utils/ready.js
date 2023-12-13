const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;

// Retry function for API requests
async function retryRequest(apiEndpoint, maxRetries = 5) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await axios.get(apiEndpoint);
      return response.data;
    } catch (error) {
      console.error(`Retry ${retries + 1}: ${error.message}`);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

module.exports = async (client, config) => {
  try {
    async function getWarframeCetus() {
      try {
        const response = await retryRequest(API.cetusAPI);
        const { state, timeLeft } = response;

        // Use ☀️ for day and 🌙 for night
        const stateEmoji = state === "day" ? "☀️" : "🌙";

        // Update the getWarframeCetus function
        if (timeLeft && /((\d+)h )?(\d+)m (\d+)s/.test(timeLeft)) {
          // Extract hours, minutes, and seconds
          const timeComponents = timeLeft.match(/((\d+)h\s*)?(\d+)m\s*(\d+)s/);
          const hours = parseInt(timeComponents[2], 10) || 0;
          const minutes = parseInt(timeComponents[3], 10);

          let formattedTimeLeft = "";

          // Display hours if it's not 0
          if (hours > 0) {
            formattedTimeLeft += `${hours}h `;
          }

          // Display minutes
          formattedTimeLeft += `${minutes}m`;

          return `${stateEmoji}${formattedTimeLeft}`;
        } else {
          console.error(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in EGYGUARD Activity:`,
            `\x1b[32m Invalid or missing timeLeft format in Warframe Cetus API response`,
            `\x1b[32m Actual timeLeft: ${timeLeft}`,
          );
          return "Unknown";
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in EGYGUARD Activity:`,
          `\x1b[32m ${error.message}`,
        );
        return "Unknown";
      }
    }

    async function getVallisCycle() {
      try {
        const response = await retryRequest(API.vallisAPI);
        const { state, timeLeft } = response;

        // Use ☀️ for warm and ❄ for cold
        const stateEmoji = state === "warm" ? "🔥" : "❄️";

        // Check if timeLeft is not null and in the expected format
        if (timeLeft && /\d+m \d+s/.test(timeLeft)) {
          // Remove seconds
          const formattedTimeLeft = timeLeft.replace(/\d+s$/, "");
          return `${stateEmoji}${formattedTimeLeft}`;
        } else {
          console.error(
            `\x1b[0m`,
            `\x1b[33m 〢`,
            `\x1b[33m ${moment(Date.now()).format("LT")}`,
            `\x1b[31m Error in EGYGUARD Activity:`,
            `\x1b[32m Invalid or missing timeLeft format in Warframe Vallis API response`,
          );
          return "Unknown";
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in EGYGUARD Activity:`,
          `\x1b[32m ${error.message}`,
        );
        return "Unknown";
      }
    }

    async function getCambionCycle() {
      try {
        const response = await retryRequest(API.cambionAPI);
        const { state, timeLeft } = response;

        // Use ☀️ for warm and ❄ for cold
        const stateEmoji = state === "warm" ? "💥" : "💦";

        // Check if timeLeft is not null and in the expected format
        if (timeLeft && /((\d+)h )?(\d+)m (\d+)s/.test(timeLeft)) {
          // Extract hours, minutes, and seconds
          const timeComponents = timeLeft.match(/((\d+)h\s*)?(\d+)m\s*(\d+)s/);
          const hours = parseInt(timeComponents[2], 10) || 0;
          const minutes = parseInt(timeComponents[3], 10);

          let formattedTimeLeft = "";

          // Display hours if it's not 0
          if (hours > 0) {
            formattedTimeLeft += `${hours}h `;
          }

          // Display minutes
          formattedTimeLeft += `${minutes}m`;

          return `${stateEmoji}${formattedTimeLeft}`;
        }
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in EGYGUARD Activity:`,
          `\x1b[32m ${error.message}`,
        );
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
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in EGYGUARD Activity:`,
          `\x1b[32m ${error.message}`,
        );
      }
    }

    setInterval(pickPresence, 10 * 1000); // Update every 10 seconds
  } catch (error) {
    console.error(
      `\x1b[0m`,
      `\x1b[33m 〢`,
      `\x1b[33m ${moment(Date.now()).format("LT")}`,
      `\x1b[31m Error in EGYGUARD Activity:`,
      `\x1b[32m ${error.message}`,
    );
  }
  console.log(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m EGYGUARD Activity`,
    `\x1b[32m UPDATED`,
  );
};
