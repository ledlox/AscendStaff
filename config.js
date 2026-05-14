try { require('dotenv').config(); } catch {}

const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX || 'as!',
  staffRole: process.env.STAFF_ROLE || 'Staff',
  adminRole: process.env.ADMIN_ROLE || 'Admin',
  logChannel: process.env.LOG_CHANNEL || 'mod-logs',
};

module.exports = config;
