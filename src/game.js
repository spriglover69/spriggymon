import { downArrow, upArrow } from "./sprites";
import withHealthbar from "./sprites/withHealthbar";

export default function startGame(you, them) {
  return new Promise((resolve) => {
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
        addText(
          `${state.you.hp <= 0 ? state.them.name : state.you.name} wins!`,
          {
            x: 3,
            y: 10,
          }
        );
        return;
      }

      setLegend(
        [trigger, withHealthbar(you.sprite, state.you.hp)],
        [amogus, withHealthbar(them.sprite, state.them.hp)],
        ["c", downArrow],
        ["d", upArrow]
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
      if (Math.random() < 0.5) {
        await attack("them");
      } else {
        await weaken("them");
      }
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

      const shouldAttack = Math.random() > 0.4;

      const hpLost = hpDeductedForStrength(opponent.strength);

      if (shouldAttack) {
        who == "you" ? (state.them.hp -= hpLost) : (state.you.hp -= hpLost);
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

      const shouldWeaken = Math.random() > 0.4;

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
      if (state.turn == "you") {
        attack("you");
      }
    });

    onInput("a", async () => {
      if (state.turn == "you") {
        weaken("you");
      }
    });

    render();
  });
}
