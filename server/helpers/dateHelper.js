function nowFormatted() {
  const now = new Date();
  now.setMilliseconds(0);
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

module.exports = { nowFormatted };