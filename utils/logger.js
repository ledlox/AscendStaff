const { EmbedBuilder } = require('discord.js');
const config = require('../config');

async function logAction(guild, action, target, moderator, reason) {
  const channel = guild.channels.cache.get(config.logChannelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle(`${action}`)
    .setDescription(`**Target:** ${target.tag} (${target.id})\n**Moderator:** ${moderator.tag}\n**Reason:** ${reason || 'No reason provided'}`)
    .setColor(getColor(action))
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}

function getColor(action) {
  const colors = {
    Ban: 0xff4444,
    Kick: 0xffaa44,
    Mute: 0xff8844,
    Warn: 0xffcc44,
    Unban: 0x44ff88,
    Purge: 0x4488ff,
  };
  return colors[action] || 0xffffff;
}

async function fetchMember(guild, id) {
  try {
    return await guild.members.fetch(id);
  } catch {
    return null;
  }
}

module.exports = { logAction, fetchMember };
