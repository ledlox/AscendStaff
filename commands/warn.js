const { EmbedBuilder } = require('discord.js');
const { requireStaff } = require('../utils/permissions');
const { logAction, fetchMember } = require('../utils/logger');

module.exports = {
  name: 'warn',
  description: 'Warn a user',
  async execute(message, args) {
    if (!requireStaff(message)) return;

    if (!args.length) return message.reply('Usage: `as!warn <user> [reason]`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const embed = new EmbedBuilder()
      .setTitle('User Warned')
      .setDescription(`**${target.user.tag}** has been warned.`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Moderator', value: message.author.tag }
      )
      .setColor(0xffcc44)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });

    try {
      await target.send(`You have been warned in **${message.guild.name}**: ${reason}`);
    } catch {}

    logAction(message.guild, 'Warn', target.user, message.author, reason);
  },
};
