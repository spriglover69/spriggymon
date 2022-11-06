function healthbarColor(healthbar) {
  if (healthbar <= 25) {
    return "3";
  } else if (healthbar <= 50) {
    return "9";
  } else {
    return "4";
  }
}

export default function withHealthbar(sprite, healthBar) {
  const size = Math.ceil(healthBar * 0.16);

  const thing = sprite
    .trim()
    .split("\n")
    .map(
      (line, index) =>
        (size >= Math.abs(index - 16) ? healthbarColor(healthBar) : "1") +
        line.trim().substring(1)
    )
    .join("\n");

  return thing;
}
