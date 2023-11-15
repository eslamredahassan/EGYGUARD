const { MessageEmbed } = require("discord.js");

const color = require("../assest/color.js");
const emoji = require("../assest/emojis");

module.exports = (client, config) => {
  client.on("guildMemberRemove", (member) => {
    // This event will run whenever a member leaves the server
    const welcomeChannel = member.guild.channels.cache.get(
      config.welcomeChannel,
    );

    if (welcomeChannel) {
      // Send a goodbye message or embed to the bye channel
      const byeEmbed = new MessageEmbed()
        .setColor(color.gray) // You can set the color to your preference
        .setTitle(`Goodbye, ${member.user.tag}!`)
        .setDescription(`We'll miss you, ${member.user.tag}.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({
          text: "Left in",
        });

      welcomeChannel.send({ embeds: [byeEmbed] });
    }
  });
};
