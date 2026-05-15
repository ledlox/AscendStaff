try { require('dotenv').config(); } catch {}

const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX || 'as!',
  staffRoleId: process.env.STAFF_ROLE_ID,
  adminRoleId: process.env.ADMIN_ROLE_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
};

module.exports = config;
