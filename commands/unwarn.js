const { EmbedBuilder } = require('discord.js');
const { requireStaff } = require('../utils/permissions');
const { logAction, fetchMember } = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const warnsPath = path.join(__dirname, '..', 'data', 'warns.json');

function getWarns() {
  try { return JSON.parse(fs.readFileSync(warnsPath, 'utf8')); }
  catch { return {}; }
}

function saveWarns(warns) {
  fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));
}

module.exports = {
  name: 'unwarn',
  description: 'Remove the most recent warn from a user',
  async execute(message, args) {
    if (!requireStaff(message)) return;

    if (!args.length) return message.reply('Usage: `as!unwarn <user> [reason]`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');

    const warns = getWarns();

    if (!warns[target.id] || warns[target.id].length === 0) {
      return message.reply('That user has no warns.');
    }

    const removed = warns[target.id].pop();
    if (warns[target.id].length === 0) delete warns[target.id];
    saveWarns(warns);

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const embed = new EmbedBuilder()
      .setTitle('Warn Removed')
      .setDescription(`Removed a warn from **${target.user.tag}**`)
      .addFields(
        { name: 'Removed Warn', value: `**Reason:** ${removed.reason}\n**Mod:** ${removed.mod}` },
        { name: 'Unwarn Reason', value: reason },
        { name: 'Moderator', value: message.author.tag }
      )
      .setColor(0x44ff88)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
    logAction(message.guild, 'Unwarn', target.user, message.author, reason);
  },
};
