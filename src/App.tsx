import React from "react";
import TreeTable from "./components/TreeTable";
import { treeData } from "./data/treeData";
import "./App.css";

const App: React.FC = () => {
  
  return (
  <div className="app">
    <h2>Goods Management Dashboard</h2>

    <div className="tree-container">
      <TreeTable data={treeData} />
    </div>
  </div>
);
};

export default App;
