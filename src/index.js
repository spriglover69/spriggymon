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
  },
  zachsGrandpa: {
    name: "Old Man",
    sprite: zachsGrandpa,
    attacks: {
      attack: "CANE",
      weaken: ["OLD MAN SMELL", "RACIAL EPITHET"][
        ~~(0.1 + Math.random())
      ],
    },
  },
  amogus: {
    name: "Amogus",
    sprite: amogus,
    attacks: {
      attack: "VENT",
      weaken: "RED SUS",
    },
  },
  orpheus: {
    name: "Orpheus",
    sprite: orpheus,
    attacks: {
      attack: "LOOK BACK",
      weaken: "FOSSILIZE",
    },
  },
};

startGame(players.orpheus, players.wasabi).then((state) => {
  console.log(`game ended. winner: ${state.you.hp <= 0 ? state.them.name : state.you.name}`)
});
