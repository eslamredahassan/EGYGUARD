// Import necessary modules and dependencies
const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");

const color = require("../assest/color.js");
const emoji = require("../assest/emojis");

registerFont("./src/assest/fonts/MediumItalic.ttf", { family: "MediumItalic" });
// Function to load an image
function loadCanvasImage(path) {
  return loadImage(path);
}

// Export the function that takes client and config as parameters
module.exports = async (client, config) => {
  let guild = client.guilds.cache.get(config.guildID);

  // Handle the interactionCreate event for slash commands
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, guild } = interaction;

    if (commandName === "verification_setup") {
      await interaction.deferReply({ ephemeral: true });
      // Check if the user has the required permissions to manage roles
      const botMember = guild.members.cache.get(client.user.id);
      if (!botMember.permissions.has("MANAGE_ROLES")) {
        return interaction.editReply(
          "I don't have the necessary permissions to manage roles. Please make sure I have the `MANAGE_ROLES` permission.",
        );
      }

      const targetChannel = options.getChannel("channel");

      // Send an embed message with a button to start the verification process
      const rules = new MessageEmbed()
        .setTitle(" ")
        .setDescription(
          `## ${emoji.rule} Main Rules\n${emoji.midMark} Explicit sexually and offensive nicknames are not allowed\n${emoji.midMark} Explicit sexually, offensive profile pictures (pfp) and contents are not allowed\n${emoji.midMark} Insulting public figures and the president of the republic will get you banned\n${emoji.midMark} Spamming mentions, links, contents, or emojis will get you timeout or banned\n${emoji.mark} Exploiting loopholes in the rules will get you banned`,
        )
        .setColor(color.gray); // You can change this color

      const general = new MessageEmbed()
        .setTitle(" ")
        .setDescription(
          `## ${emoji.members} Community Rules \n${emoji.midMark} Speaking of politics, economics, rumours or Scandals are not allowed\n${emoji.midMark} Talking about matters of religion are not allowed\n${emoji.midMark} Insults, abuse, bullying and any poisonous action are not allowed here\n${emoji.mark} Asking for free items, platinum and trading account are not allowed hereㅤㅤ`,
        )
        .setColor(color.gray); // You can change this color

      const safety = new MessageEmbed()
        .setTitle(" ")
        .setDescription(
          `## ${emoji.safety} Safety of Members \n${emoji.midMark} Jailbreaking programs, hacking tools and cheating method are not allowed\n${emoji.midMark} sharing warfame account will be at your own risk\n${emoji.midMark} Please don't share any personal information here or anywhere\n${emoji.mark} We ain't responsible for any behavior that occurs by any member in dms ㅤ ㅤ`,
        )
        .setColor(color.gray); // You can change this color

      const ads = new MessageEmbed()
        .setTitle(" ")
        .setDescription(
          `## ${emoji.ads} Advertisements and Alliances\n${emoji.midMark} Advertisements about discord servers are not allowed\n${emoji.mark} Advertisements about social media, websites and programes are not allowed`,
        )
        .setColor(color.gray); // You can change this color

      const verify = new MessageEmbed()
        .setTitle(" ")
        .setDescription(
          `## ${emoji.auth} Verification Process\n${emoji.midMark} You have to verify yourself to get access to all rooms\n${emoji.midMark} Press the **Start Verification** button below to start the verification process\n${emoji.midMark} You'll receive the captcha code in your dm\n${emoji.midMark} Reply **EGYGUARD** bot with a captcha code you will get verified\n${emoji.midMark} After that will get the access to all rooms and features here\n${emoji.mark} If you face any problem in the Verification process, **Talk to <@123788535324082178>**`,
        )
        .setColor(color.gray); // You can change this color

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("start_verification_button")
          .setLabel("Start Verification")
          .setStyle("SECONDARY")
          .setEmoji(emoji.verify),
      );

      // Reply to the user to check their DM for the verification process
      await interaction.editReply({
        embeds: [
          {
            title: `${emoji.auth} Verification System`,
            description: `${emoji.mark} The verification system has been set up in <#${targetChannel.id}>`,
            color: color.gray,
            ///thumbnail: { url: 'https://i.imgur.com/FiSTCop.png', },
            //image: { url: `${banners.appSentbanner}` },
          },
        ],
        //this is the important part
        ephemeral: true,
        components: [],
      });

      // Send the embed message with the button
      await targetChannel.send({
        embeds: [rules, general, safety, ads, verify],
        components: [row],
      });
    }
  });

  // Handle button interactions
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId, user } = interaction;

    if (customId === "start_verification_button") {
      await interaction.deferReply({ ephemeral: true });
      // Check if the user already has the verification role
      if (!guild) {
        guild = client.guilds.cache.get(config.guildID);
      }

      const member = guild.members.cache.get(user.id);
      if (member && member.roles.cache.has(config.verifyRole)) {
        return interaction.editReply({
          embeds: [
            {
              title: `${emoji.auth} Verification System`,
              description: `${emoji.mark} Hi ${interaction.user} you already verified member`,
              color: color.gray,
            },
          ],
          ephemeral: true,
        });
      } else {
        // Send the verification process to the user's DM
        await sendCaptcha(user, user.dmChannel, interaction);
        return interaction.editReply({
          embeds: [
            {
              title: `${emoji.auth} Verification System`,
              description: `${emoji.midMark} The verification process has been started in your direct message box\n${emoji.mark} Please check your direct message box`,
              color: `#2b2d31`,
              ///thumbnail: { url: 'https://i.imgur.com/FiSTCop.png', },
              //image: { url: `${banners.appSentbanner}` },
            },
          ],
          //this is the important part
          ephemeral: true,
          components: [],
        });
      }
    }
  });

  // Function to send a captcha
  async function sendCaptcha(user, channel, interaction) {
    function generateMixedCode(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }

      return result;
    }

    // Load your custom background image
    const backgroundImagePath = "./src/assest/images/captcha_background.png"; // Correct the path based on your file structure
    const background = await loadCanvasImage(backgroundImagePath);

    // Create a canvas and set its dimensions
    const canvas = createCanvas(300, 100);
    const ctx = canvas.getContext("2d");

    // Draw the fixed background image on the canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set text color and font
    ctx.fillStyle = "#2b406f"; // You can change this to any color you like
    ctx.font = "48px MediumItalic";

    // Generate a random verification code with a mix of uppercase characters, lowercase characters, and numbers
    const verificationCode = generateMixedCode(6); // Change 6 to the desired length of the code

    // Measure the width of the text
    const textWidth = ctx.measureText(verificationCode).width;

    // Calculate the x-coordinate to center the text
    const xCoordinate = (canvas.width - textWidth) / 2;

    // Draw the verification code on the canvas at the calculated x-coordinate
    ctx.fillText(verificationCode, xCoordinate, 71);

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer();

    // Set the number of attempts allowed
    const maxAttempts = 5;
    let attempts = 0;

    // Check if the user has a DM channel, create one if not
    if (!channel || !channel.send) {
      try {
        channel = await user.createDM();
      } catch (error) {
        console.error(`Failed to create DM channel: ${error.message}`);
        return;
      }
    }

    // Create a new MessageEmbed with the captcha image as an attachment
    const attachment = new MessageAttachment(buffer, "captcha.png");
    const embed = new MessageEmbed()
      .setTitle(" ")
      .setDescription(
        `${emoji.auth} Verify yourself by responding to this code`,
      )
      .setColor(color.gray) // You can change this color
      .setImage(`attachment://captcha.png`)
      .setTimestamp()
      .setFooter({
        text: "You have only 5 attempts",
        iconURL: "https://i.imgur.com/N8loLmV.png",
      });

    // Send the embed message with the captcha image
    try {
      await channel.send({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error(`Failed to send message to channel: ${error.message}`);
      return;
    }

    // Listen for a message within a specific time frame (e.g., 5 minutes)
    const filter = (msg) => msg.author.id === user.id;
    const collector = channel.createMessageCollector({
      filter,
      time: 300000,
    });

    collector.on("collect", async (msg) => {
      // Check if the user entered the correct verification code
      const enteredCode = msg.content.trim();
      if (enteredCode === verificationCode) {
        // Grant the user the verification role
        const guild = client.guilds.cache.get(config.guildID);
        const verificationRole = guild.roles.cache.get(config.verifyRole);

        if (verificationRole) {
          const member = guild.members.cache.get(user.id);
          await member.roles.add(verificationRole);

          // Stop collecting messages
          collector.stop();

          await user.send({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emoji.auth} successful`)
                .setDescription(
                  `${emoji.mark} Verification successful! You now have the verified member.`,
                ),
            ],
            ephemeral: false,
            components: [],
          });
        } else {
          await user.send(
            "Verification role not found. Please contact the server administrator.",
          );
        }
      } else {
        attempts++;

        if (attempts < maxAttempts) {
          // Incorrect attempt, inform the user and continue
          await user.send({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emoji.auth} Invalid code`)
                .setDescription(
                  `${emoji.mark} Invalid verification code, Please try again.`,
                )
                .setFooter({
                  text: `${maxAttempts - attempts} attempts left`,
                  iconURL: "https://i.imgur.com/N8loLmV.png",
                }),
            ],
            ephemeral: false,
            components: [],
          });
        } else {
          // Max attempts reached, inform the user and stop collecting messages
          await user.send({
            embeds: [
              new MessageEmbed()
                .setColor(color.gray)
                .setTitle(`${emoji.auth} Out of attempts`)
                .setDescription(
                  `${emoji.mark} Max attempts reached, Please press the start verification button again.`,
                ),
            ],
            ephemeral: false,
            components: [],
          });

          collector.stop();
        }
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time" && attempts < maxAttempts) {
        user.send({
          embeds: [
            new MessageEmbed()
              .setColor(color.gray)
              .setTitle(`${emoji.auth} Timeout`)
              .setDescription(
                `${emoji.mark} Verification timed out. Please try again if you still wish to verify.`,
              ),
          ],
          ephemeral: false,
          components: [],
        });
      }
    });

    // Function to load an image
    function loadImage(path) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
        image.src = path;
      });
    }
  }
};
