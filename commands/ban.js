const { EmbedBuilder } = require('discord.js');
const { requireAdmin } = require('../utils/permissions');
const { logAction, fetchMember } = require('../utils/logger');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server',
  async execute(message, args) {
    if (!requireAdmin(message)) return;

    if (!args.length) return message.reply('Usage: `as!ban <user> [reason]`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');

    if (!target.bannable) return message.reply('I cannot ban that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await target.ban({ reason: `Banned by ${message.author.tag}: ${reason}` });

    const embed = new EmbedBuilder()
      .setTitle('User Banned')
      .setDescription(`**${target.user.tag}** has been banned.`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Moderator', value: message.author.tag }
      )
      .setColor(0xff4444)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
    logAction(message.guild, 'Ban', target.user, message.author, reason);
  },
};
