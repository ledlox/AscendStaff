const { EmbedBuilder } = require('discord.js');
const { isStaff } = require('../utils/permissions');

module.exports = {
  name: 'serverinfo',
  aliases: ['guildinfo', 'si'],
  description: 'Get information about the server',
  async execute(message) {
    if (!isStaff(message.member)) return message.reply('Staff only.');

    const { guild } = message;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Owner', value: owner.user.tag, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'ID', value: guild.id, inline: true },
      )
      .setColor(0xaa44ff)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
