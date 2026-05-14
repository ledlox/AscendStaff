const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const { isStaff } = require('../utils/permissions');

module.exports = {
  name: 'help',
  description: 'Shows all available staff commands',
  async execute(message) {
    if (!isStaff(message.member)) {
      return message.reply('This command is for staff only.');
    }

    const embed = new EmbedBuilder()
      .setTitle('AscendStaff Commands')
      .setDescription(`Prefix: \`${config.prefix}\``)
      .setColor(0xaa44ff)
      .addFields(
        { name: 'Moderation', value: [
          `\`${config.prefix}ban <user> [reason]\` - Ban a user`,
          `\`${config.prefix}kick <user> [reason]\` - Kick a user`,
          `\`${config.prefix}mute <user> <duration> [reason]\` - Mute a user`,
          `\`${config.prefix}unmute <user>\` - Unmute a user`,
          `\`${config.prefix}warn <user> [reason]\` - Warn a user`,
          `\`${config.prefix}purge <amount>\` - Bulk delete messages`,
        ].join('\n') },
        { name: 'Utility', value: [
          `\`${config.prefix}userinfo [user]\` - Get user info`,
          `\`${config.prefix}serverinfo\` - Get server info`,
          `\`${config.prefix}help\` - Show this message`,
        ].join('\n') }
      )
      .setFooter({ text: 'AscendStaff' })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
