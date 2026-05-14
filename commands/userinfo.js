const { EmbedBuilder } = require('discord.js');
const { isStaff } = require('../utils/permissions');

module.exports = {
  name: 'userinfo',
  aliases: ['whois', 'ui'],
  description: 'Get information about a user',
  async execute(message, args) {
    if (!isStaff(message.member)) return message.reply('Staff only.');

    const target = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const roles = target.roles.cache.filter(r => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => r.name)
      .slice(0, 15);

    const embed = new EmbedBuilder()
      .setTitle(target.user.tag)
      .setThumbnail(target.user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: target.id, inline: true },
        { name: 'Joined', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Registered', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: `Roles (${roles.length})`, value: roles.length ? roles.join(', ') : 'None' },
      )
      .setColor(target.displayHexColor || 0xaa44ff)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
