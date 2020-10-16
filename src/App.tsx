import React from 'react';
import './App.less';
import { useWallet } from './utils/wallet';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import { ExchangeView } from './components/exchange';
import { shortenAddress } from './utils/utils';
import { PoolAccounts } from './components/pool/accounts';
import { Settings } from './components/settings';
import { SettingOutlined } from '@ant-design/icons';
import { Info } from './components/info';
import { Identicon } from './components/identicon';
import { useNativeAccount } from './utils/accounts';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

/*

TODO: CSS
FONTS:
  ALL CAPS TITLES: Oswald
  Body text: Rubik
  Everything else: Saira
Mobile: ... 



*/

const AccountInfo = (props: {}) => {
  const { connected, wallet } = useWallet();
  const { account } = useNativeAccount();

  if (!wallet || !wallet.publicKey) {
    return null;
  }

  return <div className="wallet-wrapper">
    <span>{((account?.lamports || 0) / LAMPORTS_PER_SOL ).toFixed(2)} SOL</span>
    <div className="wallet-key">
      {shortenAddress(`${wallet.publicKey}`)}
      <Identicon address={wallet.publicKey.toBase58()} />
    </div>
  </div>;
}

function App() {
  const { connected, wallet } = useWallet();
  const TopBar = (<div className='App-Bar'>
    <div className='App-Bar-left'>
      <div className="App-logo" />
    </div>
    <div className='App-Bar-right'>
      <AccountInfo />
      {connected && (
        <Popover placement="bottomRight" content={<PoolAccounts />} trigger="click">
          <Button type="text">My Pools</Button>
        </Popover>)}

      <div >
      {!connected && <Button
          type="text"
          size="large"
          onClick={connected ? wallet.disconnect : wallet.connect}
          style={{ color: '#2abdd2' }}
        >Connect</Button>}
        {connected && (
          <Popover
            // content={<LinkAddress address={publicKey} />}
            placement="bottomRight"
            title="Wallet public key"
            trigger="click"
          >
            {/* <InfoCircleOutlined style={{ color: '#2abdd2' }} /> */}
          </Popover>
        )}
      </div>
      {<Popover placement="topRight" title="Settings" content={<Settings />} trigger="click">
        <Button shape="circle" size="large" type="text" icon={<SettingOutlined />} />
      </Popover>}
    </div>
  </div>);

  return (
    <div className="App">
      <div className="Banner">
        <div className="Banner-description">
          Swap on Solana is beta software. Use it at your own risk.
            <Info style={{ color: 'black' }} text={
            <span>
              Any content produced by Solana, or developer resources that Solana provides, are for educational and inspiration purposes only.
              Solana does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.
              </span>
          } />
        </div>
      </div>
      {TopBar}
      <ExchangeView />
    </div>
  );
}

export default App;
