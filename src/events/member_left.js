const { MessageEmbed } = require("discord.js");

module.exports = (client, config) => {
  client.on("guildMemberRemove", (member) => {
    // This event will run whenever a member leaves the server
    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel);

    if (welcomeChannel) {
      // Send a goodbye message or embed to the bye channel
      const byeEmbed = new MessageEmbed()
        .setColor("#ff0000") // You can set the color to your preference
        .setTitle(`Goodbye, ${member.user.tag}!`)
        .setDescription(`We'll miss you, ${member.user.tag}.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      welcomeChannel.send({ embeds: [byeEmbed] });
    }
  });
};
