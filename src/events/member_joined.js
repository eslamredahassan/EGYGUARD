const { MessageEmbed } = require("discord.js");

module.exports = (client, config) => {
  client.on("guildMemberAdd", (member) => {
    // This event will run whenever a member joins the server
    const welcomeChannel = member.guild.channels.cache.get(
      config.welcomeChannel,
    );

    if (welcomeChannel) {
      // Send a welcome message or embed to the welcome channel
      const welcomeEmbed = new MessageEmbed()
        .setColor("#00ff00") // You can set the color to your preference
        .setTitle(`Welcome to ${member.guild.name}!`)
        .setDescription(`Hello ${member.user.tag}, welcome to our server!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
  });
};
