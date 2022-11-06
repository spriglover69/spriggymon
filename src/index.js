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
      attack: "used\nFACE LICK",
      weaken: "\nSAT ON YOU",
    },
  },
  zachsGrandpa: {
    name: "Old Man",
    sprite: zachsGrandpa,
    attacks: {
      attack: "used\nCANE",
      weaken: ["used\nOLD MAN SMELL", "used\nRACIAL EPITHET"][
        ~~(0.1 + Math.random())
      ],
    },
  },
  amogus: {
    name: "Amogus",
    sprite: amogus,
    attacks: {
      attack: "VENTED",
      weaken: "used\nRED SUS",
    },
  },
  orpheus: {
    name: "Orpheus",
    sprite: orpheus,
    attacks: {
      attack: "\nLOOKED BACK",
      weaken: "FOSSILIZED",
    },
  },
};

// startGame(players.orpheus, players.wasabi);
