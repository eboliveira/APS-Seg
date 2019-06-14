import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {setup_models} from './setup_db'

class App extends Component {
  state={

  }

  constructor(props) {
    super(props)
    setup_models()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
