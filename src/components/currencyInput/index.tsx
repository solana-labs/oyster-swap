import React from "react";
import { Card, Select } from "antd";
import { NumericInput } from "../numericInput";
import {
  getPoolName,
  getTokenName,
  isKnownMint,
  KnownToken,
} from "../../utils/utils";
import { useUserAccounts, useMint, useCachedPool } from "../../utils/accounts";
import "./styles.less";
import { useConnectionConfig } from "../../utils/connection";
import { PoolIcon, TokenIcon } from "../tokenIcon";
import PopularTokens from "../../utils/token-list.json";
import { PublicKey } from "@solana/web3.js";
import { PoolInfo, TokenAccount } from "../../models";

const { Option } = Select;

export const CurrencyInput = (props: {
  mint?: string;
  amount?: string;
  title?: string;
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const { userAccounts } = useUserAccounts();
  const { pools } = useCachedPool();
  const mint = useMint(props.mint);

  const { env } = useConnectionConfig();

  const tokens = PopularTokens[env] as KnownToken[];

  const renderPopularTokens = tokens.map((item) => {
    return (
      <Option
        key={item.mintAddress}
        value={item.mintAddress}
        title={item.mintAddress}
      >
        <div
          key={item.mintAddress}
          style={{ display: "flex", alignItems: "center" }}
        >
          <TokenIcon mintAddress={item.mintAddress} />
          {item.tokenSymbol}
        </div>
      </Option>
    );
  });

  // TODO: expand nested pool names ...?

  // group accounts by mint and use one with biggest balance
  const grouppedUserAccounts = userAccounts
    .sort((a, b) => {
      return b.info.amount.toNumber() - a.info.amount.toNumber();
    })
    .reduce((map, acc) => {
      const mint = acc.info.mint.toBase58();
      if (isKnownMint(env, mint)) {
        return map;
      }

      const pool = pools.find((p) => p && p.pubkeys.mint.toBase58() === mint);

      map.set(mint, (map.get(mint) || []).concat([{ account: acc, pool }]));

      return map;
    }, new Map<string, { account: TokenAccount; pool: PoolInfo | undefined }[]>());

  // TODO: group multple accounts of same time and select one with max amount
  const renderAdditionalTokens = [...grouppedUserAccounts.keys()].map(
    (mint) => {
      const list = grouppedUserAccounts.get(mint);
      if (!list || list.length <= 0) {
        return undefined;
      }

      const account = list[0];

      if (account.account.info.amount.eqn(0)) {
        return undefined;
      }

      let name: string;
      let icon: JSX.Element;
      if (account.pool) {
        name = getPoolName(env, account.pool);

        const sorted = account.pool.pubkeys.holdingMints
          .map((a: PublicKey) => a.toBase58())
          .sort();
        icon = <PoolIcon mintA={sorted[0]} mintB={sorted[1]} />;
      } else {
        name = getTokenName(env, mint);
        icon = <TokenIcon mintAddress={mint} />;
      }

      return (
        <Option
          key={account.account.pubkey.toBase58()}
          value={mint}
          title={mint}
        >
          <div key={mint} style={{ display: "flex", alignItems: "center" }}>
            {icon}
            {name}
          </div>
        </Option>
      );
    }
  );

  const userUiBalance = () => {
    const currentAccount = userAccounts?.find(
      (a) => a.info.mint.toBase58() === props.mint
    );
    if (currentAccount && mint) {
      return (
        currentAccount.info.amount.toNumber() / Math.pow(10, mint.decimals)
      );
    }

    return 0;
  };

  return (
    <Card
      className="ccy-input"
      style={{ borderRadius: 20, margin: 15 }}
      bodyStyle={{ padding: 0 }}
    >
      <div className="ccy-input-header">
        <div className="ccy-input-header-left">{props.title}</div>

        <div
          className="ccy-input-header-right"
          onClick={(e) =>
            props.onInputChange && props.onInputChange(userUiBalance())
          }
        >
          Balance: {userUiBalance().toFixed(6)}
        </div>
      </div>
      <div className="ccy-input-header" style={{ padding: "0px 10px 5px 7px" }}>
        <NumericInput
          value={props.amount}
          onChange={(val: any) => {
            if (props.onInputChange) {
              props.onInputChange(val);
            }
          }}
          style={{
            fontSize: 20,
            boxShadow: "none",
            borderColor: "transparent",
            outline: "transpaernt",
          }}
          placeholder="0.00"
        />

        <div className="ccy-input-header-right" style={{ display: "felx" }}>
          <Select
            size="large"
            style={{ minWidth: 80 }}
            placeholder="CCY"
            value={props.mint}
            dropdownMatchSelectWidth={true}
            dropdownStyle={{ minWidth: 200 }}
            onChange={(item) => {
              if (props.onMintChange) {
                props.onMintChange(item);
              }
            }}
          >
            {[...renderPopularTokens, ...renderAdditionalTokens]}
          </Select>
        </div>
      </div>
    </Card>
  );
};
