import React from "react";

interface ISideBar {}

const SideBar = (props: ISideBar) => {
  return <div className="side-bar">
    <div className="tip-panel">
      <h3>Writing on IPP</h3>
      <div className="panel-body">
        <div className="panel-item">New writer FAQ</div>
        <div className="panel-item">Expert writing advice</div>
        <div className="panel-item">Grow your readership</div>
      </div>
    </div>
  </div>;
};

export default SideBar;
