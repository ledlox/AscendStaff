const { EmbedBuilder } = require('discord.js');
const { isStaff } = require('../utils/permissions');
const { fetchMember } = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const warnsPath = path.join(__dirname, '..', 'warns.json');

function getWarns() {
  try { return JSON.parse(fs.readFileSync(warnsPath, 'utf8')); }
  catch { return {}; }
}

module.exports = {
  name: 'warns',
  description: 'List all warns for a user',
  async execute(message, args) {
    if (!isStaff(message.member)) return message.reply('Staff only.');

    if (!args.length) return message.reply('Usage: `as!warns <user>`');

    const target = message.mentions.members.first() ||
      await fetchMember(message.guild, args[0]);

    if (!target) return message.reply('Could not find that user.');

    const warns = getWarns();
    const userWarns = warns[target.id];

    if (!userWarns || userWarns.length === 0) {
      return message.reply(`**${target.user.tag}** has no warns.`);
    }

    const list = userWarns.map((w, i) =>
      `**${i + 1}.** ${w.reason} — <t:${Math.floor(w.date / 1000)}:R> by ${w.mod}`
    ).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`Warns for ${target.user.tag}`)
      .setDescription(list)
      .setColor(0xffcc44)
      .setFooter({ text: `${userWarns.length} total warn(s)` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
