const { MessageEmbed } = require("discord.js");

const color = require("../assest/color.js");
const emoji = require("../assest/emojis");

module.exports = (client, config) => {
  client.on("guildMemberAdd", (member) => {
    // This event will run whenever a member joins the server
    const welcomeChannel = member.guild.channels.cache.get(
      config.welcomeChannel,
    );

    if (welcomeChannel) {
      // Send a welcome message or embed to the welcome channel
      const welcomeEmbed = new MessageEmbed()
        .setColor(color.gray) // You can set the color to your preference
        .setTitle(`Welcome to ${member.guild.name}!`)
        .setDescription(`Hello ${member.user.tag}, welcome to our server!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({
          text: "Joined in",
        });
      welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
  });
};
