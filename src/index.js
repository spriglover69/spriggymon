import startGame from "./game";
import {
  amogus,
  trigger as triggerSprite,
  zachsGrandpa,
  orpheus,
} from "./sprites";

const players = {
  wasabi: {
    name: "Wasabi",
    sprite: triggerSprite,
    attacks: {
      attack: "FACE LICK",
      // weaken: "SIT ON YOU",
    },
    accuracy: 0,
    strength: 9,
  },
  zachsGrandpa: {
    name: "Old Man",
    sprite: zachsGrandpa,
    attacks: {
      attack: "CANE",
      weaken: ["OLD MAN SMELL", "RACIAL EPITHET"][~~(0.1 + Math.random())],
    },
  },
  amogus: {
    name: "Amogus",
    sprite: amogus,
    attacks: {
      attack: "VENT",
      weaken: "RED SUS",
      heal: "EMERGENCY MEETING",
    },
  },
  orpheus: {
    name: "Orpheus",
    sprite: orpheus,
    attacks: {
      attack: "LOOK BACK",
      weaken: "FOSSILIZE",
      heal: "CHIRP",
    },
  },
};

async function wasabiFight() {
  return await startGame(
    {
      ...players.orpheus,
      attacks: { attack: players.orpheus.attacks.attack },
      accuracy: 0.8,
    },
    players.wasabi
  );
}

async function oldManFight() {
  return await startGame(
    {
      ...players.orpheus,
      attacks: {
        attack: players.orpheus.attacks.attack,
        weaken: players.orpheus.attacks.weaken,
      },
      accuracy: 0.7,
    },
    players.zachsGrandpa
  );
}

async function amogusFight() {
  return await startGame(players.orpheus, players.amogus);
}

amogusFight();
