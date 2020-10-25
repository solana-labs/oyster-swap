import React from 'react';
import './App.less';
import { Info } from './components/info';
import GitHubButton from 'react-github-btn'
import { Routes } from './routes';

function App() {
  return (
    <div className="App">
      <div className="Banner">
        <div className="Banner-description">
          Swap on Solana is unaudited demo software. Use at your own risk
            <Info style={{ color: 'black' }} text={
            <span>
              Any content produced by Solana, or developer resources that Solana provides, are for educational and inspiration purposes only.
              Solana does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.
              </span>
          } />
        </div>
      </div>
      <Routes />
      <div className="social-buttons">
        <GitHubButton href="https://github.com/solana-labs/oyster-swap"
          data-color-scheme="no-preference: light; light: light; dark: light;"
          data-icon="octicon-star"
          data-size="large"
          data-show-count={true}
          aria-label="Star solana-labs/oyster-swap on GitHub">Star</GitHubButton>
        <GitHubButton href="https://github.com/solana-labs/oyster-swap/fork"
          data-color-scheme="no-preference: light; light: light; dark: light;"
          data-size="large"
          aria-label="Fork solana-labs/oyster-swap on GitHub">
          Fork
          </GitHubButton>
      </div>
    </div>
  );
}

export default App;
