const parseTTL = (ttl) => {
  if (typeof ttl !== "string") return Number(ttl) || 0;

  const match = ttl.match(/^(\d+)([smhd])$/); // s,m,h,d
  if (!match) throw new Error(`Invalid TTL format: ${ttl}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
};

module.exports = parseTTL;