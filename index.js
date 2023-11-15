const { Client, Intents } = require("discord.js");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
Client.setMaxListeners(0);

const config = require("./src/config");
const connect = require("./src/database/connect");
const ready = require("./src/utils/ready");
const antiCrash = require("./src/utils/antiCrash");
const deployCommands = require("./src/utils/deployCommands");
const server = require("./src/utils/server");
const logo = require("./src/assest/logo");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER"],
});

client.on("ready", async () => {
  connect(client, config);
  ready(client, config);
  server(client, config);
  antiCrash(client, config);
  deployCommands(client, config);
  console.log(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m ${client.user.tag}`,
    `\x1b[32m ONLINE`,
  );

  const loadEvents = (client, config, directory) => {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        loadEvents(client, config, fullPath); // Recursively load events in subdirectories
      } else if (file.endsWith(".js")) {
        try {
          const event = require(fullPath);
          if (typeof event === "function") {
            event(client, config);
            //console.log(`Event loaded: ${file}`);
          } else {
            console.error(
              `Invalid export in file ${file}. Expected a function.`,
            );
          }
        } catch (error) {
          console.error(`Error loading event file ${file}:`, error.message);
        }
      }
    });
  };

  const eventsDirectory = path.join(__dirname, "src/events");
  loadEvents(client, config, eventsDirectory);
});

client.once("ready", async () => {
  const loadCommands = (directory) => {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        loadCommands(fullPath); // Recursively load commands in subdirectories
      } else if (file.endsWith(".js")) {
        try {
          const command = require(fullPath);
          if (typeof command === "function") {
            command(client, config);
            //console.log(`Command loaded: ${file}`);
          } else {
            console.error(
              `Invalid export in file ${file}. Expected a function.`,
            );
          }
        } catch (error) {
          console.error(`Error loading command file ${file}:`, error.message);
        }
      }
    });
  };

  console.log(
    `\x1b[0m`,
    `\x1b[33m 〢`,
    `\x1b[33m ${moment(Date.now()).format("LT")}`,
    `\x1b[31m Slash Command Files`,
    `\x1b[32m LOADED`,
  );

  const commandsDirectory = path.join(__dirname, "src/commands");
  loadCommands(commandsDirectory);
});

client
  .login(config.token)
  .catch((error) => console.error("Token Error:", error.message));
