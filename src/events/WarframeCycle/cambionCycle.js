const axios = require("axios");
const fs = require("fs");
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
          if (remainingMinutes > 0 || hours === 0) {
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
              `Updated voice channel name to Cambion Cycle: ${cambionCycle} ${timeLeft}`,
            );
          } else {
            console.log("Voice channel not found or invalid channel type.");
          }
        } else {
          console.log("Time string format does not match expected pattern.");
        }
      } else {
        console.log(
          "Cambion state is undefined in the API response:",
          response,
        );
      }
    } catch (error) {
      console.error("Error updating Cambion cycle:", error.message);
    }
  }

  setInterval(updateCambionCycle, 60 * 1000); // Update every minute
};
