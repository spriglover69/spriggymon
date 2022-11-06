import { downArrow } from "./sprites";
import withHealthbar from "./sprites/withHealthbar";

export default function startGame(you, them) {
  const state = {
    you: {
      hp: 100,
      strength: 10,
      name: you.name,
      attacks: you.attacks,
    },

    them: {
      hp: 100,
      strength: 10,
      name: them.name,
      attacks: them.attacks,
    },
    consoleText: "",
    turn: "you",
  };

  const trigger = "a";
  const amogus = "b";

  function render() {
    console.log("render");
    clearText();

    if (state.you.hp <= 0 || state.them.hp <= 0) {
      setLegend(
        [trigger, you.sprite, state.you.hp],
        [amogus, them.sprite, state.them.hp],
        ["c", downArrow]
      );

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
      [trigger, withHealthbar(you.sprite, state.you.hp)],
      [amogus, withHealthbar(them.sprite, state.them.hp)],
      ["c", downArrow]
    );

    setMap(map`
    .....
    .${state.turn == "you" ? "c" : "."}.b.
    .a...
    .....`);

    if (state.turn == "you") {
      addText("W to ATTACK", { x: 1, y: 1 });
      addText("A to WEAKEN", { x: 1, y: 2 });
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
    const attacked = Math.random() >= 0.5 ? attack("them") : weaken("them");

    render();

    await animateBump(amogus, attacked ? { x: -1 } : { y: -1 }, 200);

    state.turn = "you";

    render();
  }

  async function animateBump(sprite, { x, y }, time) {
    console.log(getFirst(sprite).x, getFirst(sprite).y);
    getFirst(sprite).x += x || 0;
    getFirst(sprite).y += y || 0;

    console.log(getFirst(sprite).x, getFirst(sprite).y);

    await new Promise((resolve) => setTimeout(resolve, time));

    console.log(getFirst(sprite).x, getFirst(sprite).y);

    getFirst(sprite).x -= x || 0;
    getFirst(sprite).y -= y || 0;

    console.log(getFirst(sprite).x, getFirst(sprite).y);
  }

  function hpDeductedForStrength(strength) {
    const factor = Math.abs(strength - 10);

    return 10 + factor * 5;
  }

  function attack(who) {
    const player = who == "you" ? state.you : state.them;

    if (Math.random() > 0.6) {
      if (who == "you") {
        state.them.hp -= hpDeductedForStrength(state.them.strength);
      } else {
        state.you.hp -= hpDeductedForStrength(state.you.strength);
      }

      state.consoleText = `${player.name} ${player.attacks.attack}`;

      return true;
    } else {
      state.consoleText = `${player.name} MISSED`;
      return false;
    }
  }

  function weaken(who) {
    return;
    const player = who == "you" ? state.you : state.them;

    if (Math.random() > 0.4) {
      if (who == "you") {
        if (state.them.strength > 0) {
          state.them.strength -= 2;
        }
      } else {
        if (state.you.strength > 0) {
          state.you.strength -= 2;
        }
      }

      state.consoleText = `${player.name} ${player.attacks.weaken}`;

      render();
    } else {
      who == "you" ? getFirst(trigger).y-- : getFirst(amogus).y--;
      setTimeout(() => {
        who == "you" ? getFirst(trigger).y++ : getFirst(amogus).y++;
        state.consoleText = `${player.name} MISSED`;
        render();
      }, 200);
    }
  }

  onInput("w", async () => {
    if (state.turn == "you") {
      const attacked = attack("you");
      state.turn = undefined;
      render();

      await animateBump(trigger, attacked ? { x: 1 } : { y: -1 }, 200);

      if (state.them.hp > 0) {
        state.turn = "them";
        setTimeout(theyTakeTheirTurn, 1500);
      } else {
        state.turn = undefined;
      }
    }
  });

  onInput("a", () => {
    if (state.turn == "you") {
      weaken("you");
      setTimeout(theyTakeTheirTurn, 2500);
      state.turn = "them";
    }
  });

  render();
}
