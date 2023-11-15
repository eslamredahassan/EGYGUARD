const { Client, ActivityType } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const config = require("../config");
const moment = require("moment");

//// Application Sun ///

module.exports = async (client, config) => {
  let membersCount = client.guilds.cache
    .map((guild) => guild.memberCount)
    .reduce((a, b) => a + b, 0);
  const statusArray = [
    {
      type: "PLAYING",
      content: `with ${membersCount} member`,
      status: "idle",
    },
  ];
  async function pickPresence() {
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
