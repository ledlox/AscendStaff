const { EmbedBuilder } = require('discord.js');
const { requireStaff } = require('../utils/permissions');
const { logAction, fetchMember } = require('../utils/logger');

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;

  const val = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return val * (multipliers[unit] || 60000);
}

module.exports = {
  name: 'mute',
  description: 'Timeout/mute a user',
  async execute(message, args) {
    if (!requireStaff(message)) return;

    if (args.length < 2) return message.reply('Usage: `as!mute <user> <duration> [reason]`\nDuration: `10s`, `5m`, `2h`, `1d`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');
    if (!target.moderatable) return message.reply('I cannot mute that user.');

    const durationMs = parseDuration(args[1]);
    if (!durationMs) return message.reply('Invalid duration. Use `10s`, `5m`, `2h`, or `1d`.');

    const reason = args.slice(2).join(' ') || 'No reason provided';

    await target.timeout(durationMs, reason);

    const durationText = args[1];
    const embed = new EmbedBuilder()
      .setTitle('User Muted')
      .setDescription(`**${target.user.tag}** has been muted for ${durationText}.`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Moderator', value: message.author.tag }
      )
      .setColor(0xff8844)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
    logAction(message.guild, 'Mute', target.user, message.author, `${reason} (${durationText})`);
  },
};
