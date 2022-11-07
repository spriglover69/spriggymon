import { downArrow, upArrow } from "./sprites";
import withHealthbar from "./sprites/withHealthbar";

export let playerHp = 100;

export let state = {
  gameRunning: false,
  you: {
    hp: 100,
    strength: 10,
  },
  them: {
    hp: 100,
    strength: 10,
  },
  showWinner: false,
  consoleText: "",
  turn: "you",
  onGameEnd() {},
};

const trigger = "a";
const amogus = "b";

function render() {
  clearText();

  if (state.showWinner) {
    setLegend([trigger, state.you.sprite], [amogus, state.them.sprite]);

    setMap(map`
  .....
  ..${state.you.hp <= 0 ? amogus : trigger}..
  .....
  .....`);
    addText(`${state.you.hp <= 0 ? state.them.name : state.you.name} wins!`, {
      x: 3,
      y: 10,
    });
    return;
  }

  setLegend(
    [trigger, withHealthbar(state.you.sprite, state.you.hp)],
    [amogus, withHealthbar(state.them.sprite, state.them.hp)],
    ["c", downArrow],
    ["d", upArrow]
  );

  setMap(map`
    .....
    .${state.turn == "you" ? "c" : "."}.b.
    .a...
    .....`);

  if (state.turn == "you") {
    const availableAttacks = ["W to ATTACK"];
    if (state.you.attacks.weaken) availableAttacks.push("A to WEAKEN");
    if (state.you.attacks.heal && state.you.hp <= 90)
      availableAttacks.push("S to HEAL");

    availableAttacks.forEach((attack, index) => {
      addText(attack, { x: 1, y: index + 1 });
    });
  }

  if (state.consoleText) {
    state.consoleText.split("\n").forEach((line, index) => {
      addText(line, {
        x: 1,
        y: 15 - state.consoleText.split("\n").length + index,
      });
    });
  }
}

async function theyTakeTheirTurn() {
  const possibleAttacks = [];
  if (state.them.attacks.attack) possibleAttacks.push(attack);
  if (state.them.attacks.weaken) possibleAttacks.push(weaken);
  if (state.them.attacks.heal && state.them.hp <= 90)
    possibleAttacks.push(heal);

  // choose one at random
  possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)]("them");
}

async function animateBump(sprite, { x, y }, time) {
  getFirst(sprite).x += x || 0;
  getFirst(sprite).y += y || 0;

  await new Promise((resolve) => setTimeout(resolve, time));

  getFirst(sprite).x -= x || 0;
  getFirst(sprite).y -= y || 0;
}

function hpDeductedForStrength(strength) {
  const factor = Math.abs(strength - 10);

  return 10 + factor * 5;
}

async function attack(who) {
  const player = who == "you" ? state.you : state.them;
  const opponent = who == "you" ? state.them : state.you;

  state.turn = undefined; // prevent user from inputting again

  state.consoleText = `${player.name} used\n${player.attacks.attack}...`;
  render();

  await new Promise((res) => setTimeout(res, 1000));

  const shouldAttack = Math.random() < (player.accuracy ?? 0.6);

  const hpLost = hpDeductedForStrength(opponent.strength);

  if (shouldAttack) {
    if (who == "you") {
      state.them.hp -= hpLost;
    } else {
      state.you.hp -= hpLost;
      playerHp = state.you.hp;
    }

    state.consoleText = `... and ${opponent.name}\nlost ${hpLost} HP`;
  } else {
    state.consoleText = "... but missed";
  }

  render();

  await animateBump(
    who == "you" ? trigger : amogus,
    shouldAttack ? { x: who == "you" ? 1 : -1 } : { y: -1 },
    200
  );

  // check for a win
  if (state.you.hp <= 0 || state.them.hp <= 0) {
    setTimeout(() => {
      state.showWinner = true;
      render();
    }, 1000);
    setTimeout(() => {
      state.onGameEnd(state);
      state.gameRunning = false;
    }, 2000);
    return;
  }

  if (who == "you") {
    state.turn = "them";
    setTimeout(theyTakeTheirTurn, 2000);
  } else {
    state.turn = "you";
  }

  render();
}

async function heal(who) {
  const player = who == "you" ? state.you : state.them;

  state.turn = undefined; // prevent user from inputting again

  state.consoleText = `${player.name} used\n${player.attacks.heal}...`;
  render();

  await new Promise((res) => setTimeout(res, 1000));

  const shouldHeal = true; // just in case it should be made random later

  const hpGained = 10;

  if (shouldHeal) {
    if (who == "you") {
      state.you.hp += hpGained;
      playerHp = state.you.hp;
    } else {
      state.them.hp += hpGained;
    }

    state.consoleText = `... and healed to\n+${hpGained} HP`;
  } else {
    state.consoleText = "... but missed";
  }

  render();

  // await animateBump(
  //   who == "you" ? trigger : amogus,
  //   shouldHeal ? { x: who == "you" ? 1 : -1 } : { y: -1 },
  //   200
  // );

  if (who == "you") {
    state.turn = "them";
    setTimeout(theyTakeTheirTurn, 2000);
  } else {
    state.turn = "you";
  }

  render();
}

async function weaken(who) {
  const player = who == "you" ? state.you : state.them;
  const opponent = who == "you" ? state.them : state.you;

  state.turn = undefined; // prevent user from inputting again

  state.consoleText = `${player.name} used\n${player.attacks.weaken}...`;
  render();

  await new Promise((res) => setTimeout(res, 1000));

  const shouldWeaken = Math.random() < (player.accuracy ?? 0.6);

  if (shouldWeaken) {
    who == "you" ? (state.them.strength -= 2) : (state.you.strength -= 2);
    state.consoleText = `... and ${opponent.name}\nwas WEAKENED`;
  } else {
    state.consoleText = "... but missed";
  }

  render();

  await animateBump(
    who == "you" ? trigger : amogus,
    shouldWeaken ? { x: who == "you" ? 1 : -1 } : { y: -1 },
    200
  );

  if (who == "you") {
    state.turn = "them";
    setTimeout(theyTakeTheirTurn, 2000);
  } else {
    state.turn = "you";
  }

  render();
}

onInput("w", async () => {
  if (state.gameRunning && state.turn == "you") {
    attack("you");
  }
});

onInput("a", async () => {
  if (state.gameRunning && state.you.attacks.weaken && state.turn == "you") {
    weaken("you");
  }
});

onInput("s", async () => {
  if (
    state.gameRunning &&
    state.you.attacks.heal &&
    state.you.hp <= 90 &&
    state.turn == "you"
  ) {
    heal("you");
  }
});

export default function startGame(you, them) {
  return new Promise((resolve) => {
    // reset state
    state = {
      gameRunning: true,
      you: {
        hp: playerHp,
        strength: 10,
        ...you,
      },
      them: {
        hp: 100,
        strength: 10,
        ...them,
      },
      showWinner: false,
      consoleText: "",
      turn: "you",
      onGameEnd: resolve,
    };

    render();
  });
}
