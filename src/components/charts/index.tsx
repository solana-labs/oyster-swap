import React, { useState } from "react";
import { Button, Card, Popover, Table } from "antd";
import { TradeEntry } from "./../trade";
import { AddToLiquidity } from "./../pool/add";
import { useWallet } from "./../../utils/wallet";
import { AppBar } from './../appBar';
import { List } from "antd/lib/form/Form";
import { usePools } from "../../utils/pools";
import { cache, getCachedAccount, useCachedPool } from "../../utils/accounts";
import { convert, getPoolName } from "../../utils/utils";
import { useConnectionConfig } from "../../utils/connection";
import { Settings } from "../settings";
import { SettingOutlined } from "@ant-design/icons";
import { PoolIcon, TokenIcon } from "../tokenIcon";

export const ChartsView = (props: {}) => {
  const { connected, wallet } = useWallet();
  const { env } = useConnectionConfig();
  const { pools } = useCachedPool();

  // TODO: query all mints for holding accounts and all holding accounts ... 

  // TODO: load all markets based on the pool info

  // TODO: load all bid/ask data to create orderbook

  const dataSource = pools.filter(p => p.pubkeys.holdingMints && p.pubkeys.holdingMints.length > 1).map((p, index) => {
    const mints = (p.pubkeys.holdingMints || []).map((a) => a.toBase58()).sort();
    const indexA = mints[0] === p.pubkeys.holdingMints[0].toBase58() ? 0 : 1;
    const indexB = indexA === 0 ? 1 : 0;
    const accountA = cache.getAccount(p.pubkeys.holdingAccounts[indexA]);
    const mintA = cache.getMint(mints[0]);
    const accountB = cache.getAccount(p.pubkeys.holdingAccounts[indexB]);
    const mintB = cache.getMint(mints[1]);

    const lpMint = cache.getMint(p.pubkeys.mint);

    return {
      key: p.pubkeys.account.toBase58(),
      id: index,
      name: getPoolName(env, p),
      address: p.pubkeys.mint.toBase58(),
      mints,
      liquidityA: convert(accountA, mintA),
      liquidityB: convert(accountB, mintB),
      supply: lpMint && lpMint?.supply.toNumber() / Math.pow(10, lpMint?.decimals || 0),
      raw: p,
    }
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render(text: string, record: any) {
        return {
          props: {
            style: {}
          },
          children: <div style={{ display: 'flex' }}><PoolIcon mintA={record.mints[0]} mintB={record.mints[1]} /> {text}</div>
        };
      }
    },
    {
      title: 'Liquidity A',
      dataIndex: 'liquidityA',
      key: 'liquidityA',
    },
    {
      title: 'Liquidity B',
      dataIndex: 'liquidityB',
      key: 'liquidityB',
    },
    {
      title: 'Supply',
      dataIndex: 'supply',
      key: 'supply',
      sorter: (a: any, b: any) => a.supply - b.supply,
      sortOrder: 'descend' as any,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render(text: string, record: any) {
        return {
          props: {
            style: { fontFamily: 'monospace' } as React.CSSProperties
          },
          children: <span>{text}</span>
        };
      }
    },
  ];

  return (
    <>
      <AppBar right={
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
      } />
      <Table dataSource={dataSource} columns={columns} >
      </Table>
    </>
  );
};
