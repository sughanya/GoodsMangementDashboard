import { TreeNode } from "../types";

export const deepClone = <T>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

export const recalc = (node: TreeNode): number => {
  if (!node.children) return node.value;
  node.children.forEach(recalc);
  node.value = node.children.reduce((s, c) => s + c.value, 0);
  return node.value;
};

export const distribute = (node: TreeNode, newValue: number): void => {
  if (!node.children) {
    node.value = newValue;
    return;
  }

  const total = node.children.reduce((s, c) => s + c.value, 0);

  node.children.forEach((c) => {
    const ratio =
      total === 0 ? 1 / node.children!.length : c.value / total;
    distribute(c, +(newValue * ratio).toFixed(4));
  });
};

export const variance = (value: number, original: number): string => {
  if (original === 0) return "0%";
  return (((value - original) / original) * 100).toFixed(2) + "%";
};
