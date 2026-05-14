const { EmbedBuilder } = require('discord.js');
const { requireStaff } = require('../utils/permissions');
const { logAction, fetchMember } = require('../utils/logger');

module.exports = {
  name: 'unmute',
  description: 'Remove a timeout from a user',
  async execute(message, args) {
    if (!requireStaff(message)) return;

    if (!args.length) return message.reply('Usage: `as!unmute <user>`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');
    if (!target.communicationDisabledUntil) return message.reply('That user is not muted.');

    await target.timeout(null);

    const embed = new EmbedBuilder()
      .setTitle('User Unmuted')
      .setDescription(`**${target.user.tag}** has been unmuted.`)
      .addFields({ name: 'Moderator', value: message.author.tag })
      .setColor(0x44ff88)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
    logAction(message.guild, 'Unmute', target.user, message.author, 'Unmuted');
  },
};
