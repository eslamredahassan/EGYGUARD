const axios = require("axios");
const { MessageEmbed } = require("discord.js"); // Import MessageEmbed
const moment = require("moment");
const fs = require("fs");

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const settings = JSON.parse(fs.readFileSync("./src/assest/assest.json"));
const API = cycleConfig.warframeAPI;
const emoji = settings.emoji;
const color = settings.color;

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
  let cycleMessageId; // Variable to store the ID of the sent embed
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "world_cycle") {
      await interaction.deferReply({ ephemeral: true });
      try {
        // Access the 'channel' option correctly
        const channel = interaction.options.getChannel("channel");

        async function getWarframeCetus() {
          try {
            const response = await retryRequest(API.cetusAPI);
            const { state, timeLeft } = response;

            // Use ☀️ for day and 🌙 for night
            const stateEmoji = state === "day" ? "☀️" : "🌙";

            // Update the getWarframeCetus function
            if (timeLeft && /((\d+)h )?(\d+)m (\d+)s/.test(timeLeft)) {
              // Extract hours, minutes, and seconds
              const timeComponents = timeLeft.match(
                /((\d+)h\s*)?(\d+)m\s*(\d+)s/,
              );
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
                `\x1b[31m Error in World Cycle:`,
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
              `\x1b[31m Error in World Cycle:`,
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
                `\x1b[31m Error in World Cycle:`,
                `\x1b[32m Invalid or missing timeLeft format in Warframe Vallis API response`,
              );
              return "Unknown";
            }
          } catch (error) {
            console.error(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Error in World Cycle:`,
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
              const timeComponents = timeLeft.match(
                /((\d+)h\s*)?(\d+)m\s*(\d+)s/,
              );
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
              `\x1b[31m Error in World Cycle:`,
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
            // If the message ID is available, edit the existing message
            if (cycleMessageId) {
              const cycle = new MessageEmbed()
                .setTitle(" ")
                .setDescription(`${emoji.mark} ${presenceString}`)
                .setColor(color.gray);

              // Edit the existing message
              await channel.messages.edit(cycleMessageId, {
                embeds: [cycle],
                components: [],
              });
            } else {
              // Send the initial message
              const cycle = new MessageEmbed()
                .setTitle(" ")
                .setDescription(`${emoji.mark} ${presenceString}`)
                .setColor(color.gray);

              const message = await channel.send({
                embeds: [cycle],
                components: [],
              });

              // Store the message ID for future edits
              cycleMessageId = message.id;
            }
          } catch (error) {
            console.error(
              `\x1b[0m`,
              `\x1b[33m 〢`,
              `\x1b[33m ${moment(Date.now()).format("LT")}`,
              `\x1b[31m Error in World Cycle:`,
              `\x1b[32m ${error.message}`,
            );
          }
        }

        // Reply to the user to check their DM for the verification process
        await interaction.editReply({
          embeds: [
            {
              description: `${emoji.mark} The verification system has been set up in <#${channel.id}>`,
              color: color.gray,
            },
          ],
          ephemeral: true,
          components: [],
        });

        setInterval(pickPresence, 10 * 1000); // Update every 10 seconds
      } catch (error) {
        console.error(
          `\x1b[0m`,
          `\x1b[33m 〢`,
          `\x1b[33m ${moment(Date.now()).format("LT")}`,
          `\x1b[31m Error in World Cycle:`,
          `\x1b[32m ${error.message}`,
        );
      }
    }
  });
};
