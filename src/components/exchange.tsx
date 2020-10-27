import React, { useState } from "react";
import { Button, Card, Popover } from "antd";
import { TradeEntry } from "./trade";
import { AddToLiquidity } from "./pool/add";
import { PoolAccounts } from "./pool/view";
import { useWallet } from "../utils/wallet";
import { AccountInfo } from "./accountInfo";
import { Settings } from "./settings";
import { SettingOutlined } from "@ant-design/icons";

export const ExchangeView = (props: {}) => {
  const { connected, wallet } = useWallet();
  const tabStyle: React.CSSProperties = { width: 120 };
  const tabList = [
    {
      key: "trade",
      tab: <div style={tabStyle}>Trade</div>,
      render: () => {
        return <TradeEntry />;
      },
    },
    {
      key: "pool",
      tab: <div style={tabStyle}>Pool</div>,
      render: () => {
        return <AddToLiquidity />;
      },
    },
  ];

  const [activeTab, setActiveTab] = useState(tabList[0].key);

  const TopBar = (
    <div className="App-Bar">
      <div className="App-Bar-left">
        <div className="App-logo" />
      </div>
      <div className="App-Bar-right">
        <Button type="text" size="large" style={{ color: "#2abdd2" }}>
          <a
            href={"https://dex.projectserum.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Trade
          </a>
        </Button>
        <AccountInfo />
        {connected && (
          <Popover
            placement="bottomRight"
            content={<PoolAccounts />}
            trigger="click"
          >
            <Button type="text">My Pools</Button>
          </Popover>
        )}
        <div>
          {!connected && (
            <Button
              type="text"
              size="large"
              onClick={connected ? wallet.disconnect : wallet.connect}
              style={{ color: "#2abdd2" }}
            >
              Connect
            </Button>
          )}
          {connected && (
            <Popover
              placement="bottomRight"
              title="Wallet public key"
              trigger="click"
            ></Popover>
          )}
        </div>
        {
          <Popover
            placement="topRight"
            title="Settings"
            content={<Settings />}
            trigger="click"
          >
            <Button
              shape="circle"
              size="large"
              type="text"
              icon={<SettingOutlined />}
            />
          </Popover>
        }
      </div>
    </div>
  );

  return (
    <>
      {TopBar}
      <Card
        className="exchange-card"
        headStyle={{ padding: 0 }}
        tabList={tabList}
        tabProps={{
          tabBarGutter: 0,
        }}
        activeTabKey={activeTab}
        onTabChange={(key) => {
          setActiveTab(key);
        }}
      >
        {tabList.find((t) => t.key === activeTab)?.render()}
      </Card>
    </>
  );
};
