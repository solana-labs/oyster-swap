import React from "react";
import "./App.less";
import GitHubButton from "react-github-btn";
import { Routes } from "./routes";

function App() {
  return (
    <div className="App">
      <div className="Banner">
        <div className="Banner-description">
          Anti SWap 
        </div>
      </div>
      <Routes />
      <div className="social-buttons">
        <GitHubButton
          href="https://github.com/crownholder"
          data-color-scheme="no-preference: light; light: light; dark: light;"
          data-icon="octicon-star"
          data-size="large"
          data-show-count={true}
          aria-label="Star solana-labs/oyster-swap on GitHub"
        >
          Star
        </GitHubButton>
        <GitHubButton
          href="https://github.com/crownholder"
          data-color-scheme="no-preference: light; light: light; dark: light;"
          data-size="large"
          aria-label="Anti Git Hub Account "
        >
          Fork
        </GitHubButton>
      </div>
    </div>
  );
}

export default App;
