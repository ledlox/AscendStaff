const { EmbedBuilder } = require('discord.js');
const { requireStaff } = require('../utils/permissions');

module.exports = {
  name: 'purge',
  aliases: ['clear'],
  description: 'Bulk delete messages',
  async execute(message, args) {
    if (!requireStaff(message)) return;

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply('Usage: `as!purge <1-100>`');
    }

    const messages = await message.channel.messages.fetch({ limit: amount });
    await message.channel.bulkDelete(messages, true);

    const embed = new EmbedBuilder()
      .setTitle('Messages Purged')
      .setDescription(`Deleted **${messages.size}** messages in ${message.channel}.`)
      .addFields({ name: 'Moderator', value: message.author.tag })
      .setColor(0x4488ff)
      .setTimestamp();

    const reply = await message.channel.send({ embeds: [embed] });
    setTimeout(() => reply.delete().catch(() => {}), 5000);
  },
};
