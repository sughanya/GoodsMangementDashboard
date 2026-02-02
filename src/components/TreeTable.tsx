import React from "react";
import { TreeNode } from "../types";
import { deepClone, recalc, distribute, variance } from "../utils/treeUtils";

interface Props {
  data: TreeNode[];
}

interface State {
  rows: TreeNode[];
  inputs: Record<string, string>;
}

class TreeTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rows: deepClone(props.data),
      inputs: {}
    };
  }

  findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const found = this.findNode(n.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  updateTree = (fn: (rows: TreeNode[]) => void) => {
    const rows = deepClone(this.state.rows);
    fn(rows);
    rows.forEach(recalc);
    this.setState({ rows });
  };

  handleInput = (id: string, value: string) => {
    this.setState({
      inputs: { ...this.state.inputs, [id]: value }
    });
  };

  applyPercent = (node: TreeNode) => {
    const pct = Number(this.state.inputs[node.id]);
    if (isNaN(pct)) return;

    this.updateTree((rows) => {
      const target = this.findNode(rows, node.id);
      if (target) {
        distribute(
          target,
          +(target.value * (1 + pct / 100)).toFixed(4)
        );
      }
    });
  };
  
  applyValue = (node: TreeNode) => {
    const val = Number(this.state.inputs[node.id]);
    if (isNaN(val)) return;

    this.updateTree((rows) => {
      const target = this.findNode(rows, node.id);
      if (target) distribute(target, val);
    });
  };

  renderRow = (node: TreeNode, level = 0): JSX.Element => (
    <React.Fragment key={node.id}>
      <tr>
        <td style={{ paddingLeft: level * 20 }}>
          {level > 0 && "-- "} {node.label}
        </td>

        <td>{node.value.toFixed(2)}</td>

        <td className="buttoncellcenter">
          <input
            type="number"
            onChange={(e) =>
              this.handleInput(node.id, e.target.value)
            }
          />
        </td>

        <td className="buttoncell">
          <button onClick={() => this.applyPercent(node)}>
            %
          </button>
        </td>

        <td className="buttoncellcenter">
          <button onClick={() => this.applyValue(node)}>
            Val
          </button>
        </td>

        <td className="buttoncellcenter">{variance(node.value, node.originalValue)}</td>
      </tr>

      {node.children?.map((c) =>
        this.renderRow(c, level + 1)
      )}
    </React.Fragment>
  );

  render() {
    const { rows } = this.state;

    const grandTotal = rows.reduce((s, r) => s + r.value, 0);
    const originalTotal = rows.reduce(
      (s, r) => s + r.originalValue,
      0
    );

    return (
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => this.renderRow(r))}

          <tr>
            <td><b>Grand Total</b></td>
            <td>{grandTotal.toFixed(2)}</td>
            <td colSpan={3}></td>
            <td className="buttoncell">
              {(
                ((grandTotal - originalTotal) /
                  originalTotal) *
                100
              ).toFixed(2)}
              %
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default TreeTable;
