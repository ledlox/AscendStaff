const { EmbedBuilder } = require('discord.js');
const { requireStaff } = require('../utils/permissions');
const { logAction, fetchMember } = require('../utils/logger');

module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  async execute(message, args) {
    if (!requireStaff(message)) return;

    if (!args.length) return message.reply('Usage: `as!kick <user> [reason]`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');
    if (!target.kickable) return message.reply('I cannot kick that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await target.kick(`Kicked by ${message.author.tag}: ${reason}`);

    const embed = new EmbedBuilder()
      .setTitle('User Kicked')
      .setDescription(`**${target.user.tag}** has been kicked.`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Moderator', value: message.author.tag }
      )
      .setColor(0xffaa44)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
    logAction(message.guild, 'Kick', target.user, message.author, reason);
  },
};
