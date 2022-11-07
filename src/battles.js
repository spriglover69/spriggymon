import startGame from "./game";
import { amogus, wasabi, zachsGrandpa, orpheus, trigger } from "./sprites";

const players = {
  wasabi: {
    name: "Wasabi",
    sprite: wasabi,
    attacks: {
      attack: "FACE LICK",
      // weaken: "SIT ON YOU",
    },
    accuracy: 0,
    strength: 9,
  },
  trigger: {
    name: "Trigger",
    sprite: trigger,
    attacks: {
      attack: "FACE BITE",
      weaken: "SIT ON YOU",
    },
    strength: 8,
    accuracy: 0.8,
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

export async function wasabiBattle() {
  return await startGame(
    {
      ...players.orpheus,
      attacks: { attack: players.orpheus.attacks.attack },
      accuracy: 0.8,
    },
    players.wasabi
  );
}

export async function oldManBattle() {
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

export async function amogusBattle() {
  return await startGame(players.orpheus, players.amogus);
}

export async function triggerBattle() {
  return await startGame(players.orpheus, players.trigger);
}
