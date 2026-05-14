const config = require('../config.json');

function isStaff(member) {
  if (!member) return false;
  if (member.permissions.has('Administrator')) return true;
  return member.roles.cache.some(r =>
    r.name === config.staffRole || r.name === config.adminRole
  );
}

function isAdmin(member) {
  if (!member) return false;
  if (member.permissions.has('Administrator')) return true;
  return member.roles.cache.some(r => r.name === config.adminRole);
}

function requireStaff(message) {
  if (!isStaff(message.member)) {
    message.reply('You do not have permission to use this command.');
    return false;
  }
  return true;
}

function requireAdmin(message) {
  if (!isAdmin(message.member)) {
    message.reply('Only admins can use this command.');
    return false;
  }
  return true;
}

module.exports = { isStaff, isAdmin, requireStaff, requireAdmin };
