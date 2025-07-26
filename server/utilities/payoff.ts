import type { Choice } from "./types";

const payoff = (a: Choice, b: Choice): [number, number] => {
  if (a === "cooperate" && b === "cooperate") return [3, 3];
  if (a === "cooperate" && b === "defect") return [0, 5];
  if (a === "defect" && b === "cooperate") return [5, 0];
  if (a === "defect" && b === "defect") return [0, 0];
  return [0, 0];
};

export default payoff;
