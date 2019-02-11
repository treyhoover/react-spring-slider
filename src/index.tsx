import React from "react";
import ReactDOM from "react-dom";
import Slider from "./Slider";
import * as serviceWorker from "./serviceWorker";
import "tachyons/css/tachyons.css";

const items = ["red", "orange", "yellow", "green", "blue"];

ReactDOM.render(
  <React.StrictMode>
    <Slider<string> pageSize={3} items={items} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
