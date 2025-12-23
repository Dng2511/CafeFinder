function addHours(date, hours) {
  if (!date) return date;
  // ensure we work with Date object
  const d = (date instanceof Date) ? new Date(date) : new Date(String(date));
  if (isNaN(d.getTime())) return date;
  d.setHours(d.getHours() + Number(hours));
  return d.toISOString();
}

module.exports = { addHours };