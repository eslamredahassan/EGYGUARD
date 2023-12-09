const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const config = require("../../../src/config.js");
const assest = JSON.parse(fs.readFileSync("./src/assest/assest.json"));
const emoji = assest.emoji;
const color = assest.color;
const role = assest.role;

const cycleConfig = JSON.parse(fs.readFileSync("./src/config.json"));
const API = cycleConfig.warframeAPI;
const Channel = cycleConfig.WarframeCycle;

const mockResponse = {
  data: {
    active: true,
    location: "Strata Relay (Earth)",
    inventory: ["Primed Flow", "Primed Ammo Stock", "Primed Animal Instinct"],
    activation: "2023-12-08T08:22:00.000Z",
    expiry: "2023-12-17T14:00:00.000Z",
  },
};
let interval;

module.exports = async (client, config) => {
  async function updateBaroKiTeer() {
    try {
      const response = await axios.get(API.baroAPI);
      const isActive = response.data.active;

      if (isActive !== undefined) {
        const location = response.data.location || "Unknown";
        const inventory = response.data.inventory || [];
        const start = response.data.activation || "Unknown";
        const end = response.data.expiry || "Unknown";
        const baroCycle = `${emoji.baro} Baro Ki'Teer`;

        const guild = client.guilds.cache.get(config.guildID);
        if (!guild) {
          console.log("Guild not found in cache.");
          return;
        }

        const channel = guild.channels.cache.get(Channel.publicChat);
        if (channel && channel.type === "GUILD_TEXT") {
          if (isActive) {
            const startTimestamp = Math.floor(Date.parse(start) / 1000);
            const endTimeStamp = new Date(end).getTime();

            const inventoryWithLinks = inventory.map((item, index) => {
              const wikiLink = `https://warframe.fandom.com/wiki/${encodeURIComponent(
                item.replace(/\s+/g, "_"),
              )}`;
              const mark =
                index === inventory.length - 1 ? emoji.mark : emoji.midMark;
              return `${mark} [${item}](${wikiLink})`;
            });

            const embed = new MessageEmbed()
              //.setTitle(`${baroCycle} ${isActive ? "has arrived" : "didn't Arrive yet"}`,)
              .setImage("https://i.imgur.com/0KhYPrk.gif")
              .setColor(isActive ? color.gray : color.gray)
              .setDescription(
                `## ${emoji.inventory} Inventory\n**${inventoryWithLinks.join(
                  "\n",
                )}**`,
              )
              .setFields([
                {
                  name: `${emoji.location} Leaves`,
                  value: `${emoji.mark} ${location}`,
                  inline: false,
                },
                {
                  name: `${emoji.arrived} Arrived`,
                  value: `${emoji.mark} <t:${startTimestamp}:R>`,
                  inline: true,
                },
                {
                  name: `${emoji.leave} Leaves`,
                  value: `${emoji.mark} <t:${Math.floor(
                    endTimeStamp / 1000,
                  )}:R>`,
                  inline: true,
                },
              ])
              .setFooter({
                text:
                  client.user.username +
                  " ・ Powered by Warframe API and warframe.fandom.com",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              });

            try {
              await channel.send({
                content:
                  role.alert +
                  " baro ki'teer has arrived, check out his inventory",
                embeds: [embed],
              });
              console.log("Message sent successfully");
              clearInterval(interval); // Clear the interval after sending the message
            } catch (error) {
              console.error("Error sending message:", error.message);
            }
          } else {
            return;
          }
        } else {
          console.log("Chat channel not found or invalid channel type.");
        }
      } else {
        console.log(
          "Baro Ki'Teer status is undefined in the API response:",
          response,
        );
      }
    } catch (error) {
      console.error("Error updating Baro Ki'Teer status:", error.message);
    }
  }

  // Set interval to update every minute (adjust as needed)
  interval = setInterval(updateBaroKiTeer, 5000);
};
