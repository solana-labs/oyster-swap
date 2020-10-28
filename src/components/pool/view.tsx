import React from "react";
import { ConfigProvider, Empty } from "antd";
import { useOwnedPools } from "../../utils/pools";
import { RemoveLiquidity } from "./remove";
import { getPoolName } from "../../utils/utils";
import { useMint } from "../../utils/accounts";
import { useConnectionConfig } from "../../utils/connection";
import { PoolIcon } from "../tokenIcon";
import { PoolInfo, TokenAccount } from "../../models";
import { useCurrencyPairState } from "../../utils/currencyPair";
import "./view.less";

const PoolItem = (props: {
  item: { pool: PoolInfo; isFeeAccount: boolean; account: TokenAccount };
}) => {
  const { env } = useConnectionConfig();
  const { A, B } = useCurrencyPairState();
  const item = props.item;
  const mint = useMint(item.account.info.mint.toBase58());
  const amount =
    item.account.info.amount.toNumber() / Math.pow(10, mint?.decimals || 0);

  if (!amount) {
    return null;
  }

  const setPair = () => {
    A.setMint(props.item.pool.pubkeys.holdingMints[0].toBase58());
    B.setMint(props.item.pool.pubkeys.holdingMints[1].toBase58());
  };

  const sorted = item.pool.pubkeys.holdingMints.map((a) => a.toBase58()).sort();

  if (item) {
    return (
      <div
        className="pool-item-row"
        onClick={setPair}
        title={`LP Token: ${props.item.pool.pubkeys.mint.toBase58()}`}
      >
        <div className="pool-item-amount">{amount.toFixed(4)}</div>
        <div className="pool-item-type" title="Fee account">
          {item.isFeeAccount ? " (F) " : " "}
        </div>
        <PoolIcon
          mintA={sorted[0]}
          mintB={sorted[1]}
          style={{ marginLeft: "0.5rem" }}
        />
        <div className="pool-item-name">{getPoolName(env, item.pool)}</div>
        <RemoveLiquidity instance={item} />
      </div>
    );
  }

  return null;
};

export const PoolAccounts = () => {
  const pools = useOwnedPools();

  return (
    <>
      <div>Your Liquidity</div>
      <ConfigProvider
        renderEmpty={() => (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No liquidity found."
          />
        )}
      >
        <div className="pools-grid">
          {pools.map((p) => (
            <PoolItem key={p?.account.pubkey.toBase58()} item={p as any} />
          ))}
        </div>
      </ConfigProvider>
    </>
  );
};
