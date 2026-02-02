export interface TreeNode {
  id: string;
  label: string;
  value: number;
  originalValue: number;
  children?: TreeNode[];
}
