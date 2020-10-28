import React, { useState } from "react";
import { addLiquidity, usePoolForBasket } from "../../utils/pools";
import { Button, Dropdown, Popover } from "antd";
import { useWallet } from "../../utils/wallet";
import {
  useConnection,
  useConnectionConfig,
  useSlippageConfig,
} from "../../utils/connection";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { notify } from "../../utils/notifications";
import { SupplyOverview } from "./supplyOverview";
import { CurrencyInput } from "../currencyInput";
import { DEFAULT_DENOMINATOR, PoolConfigCard } from "./config";
import "./add.less";
import { PoolConfig } from "../../models";
import { SWAP_PROGRAM_OWNER_FEE_ADDRESS } from "../../utils/ids";
import { useCurrencyPairState } from "../../utils/currencyPair";
import {
  CREATE_POOL_LABEL,
  ADD_LIQUIDITY_LABEL,
  generateActionLabel,
} from "../labels";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const AddToLiquidity = () => {
  const { wallet, connected } = useWallet();
  const connection = useConnection();
  const [pendingTx, setPendingTx] = useState(false);
  const { A, B, setLastTypedAccount } = useCurrencyPairState();
  const pool = usePoolForBasket([A?.mintAddress, B?.mintAddress]);
  const { slippage } = useSlippageConfig();
  const { env } = useConnectionConfig();
  const [options, setOptions] = useState<PoolConfig>({
    curveType: 0,
    tradeFeeNumerator: 25,
    tradeFeeDenominator: DEFAULT_DENOMINATOR,
    ownerTradeFeeNumerator: 5,
    ownerTradeFeeDenominator: DEFAULT_DENOMINATOR,
    ownerWithdrawFeeNumerator: 0,
    ownerWithdrawFeeDenominator: DEFAULT_DENOMINATOR,
  });

  const executeAction = !connected
    ? wallet.connect
    : async () => {
      if (A.account && B.account && A.mint && B.mint) {
        setPendingTx(true);
        const components = [
          {
            account: A.account,
            mintAddress: A.mintAddress,
            amount: A.convertAmount(),
          },
          {
            account: B.account,
            mintAddress: B.mintAddress,
            amount: B.convertAmount(),
          },
        ];

        addLiquidity(connection, wallet, components, slippage, pool, options)
          .then(() => {
            setPendingTx(false);
          })
          .catch((e) => {
            console.log("Transaction failed", e);
            notify({
              description:
                "Please try again and approve transactions from your wallet",
              message: "Adding liquidity cancelled.",
              type: "error",
            });
            setPendingTx(false);
          });
      }
    };

  const hasSufficientBalance = A.sufficientBalance() && B.sufficientBalance();

  const createPoolButton = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? (
    <Button
      className="add-button"
      onClick={executeAction}
      disabled={
        connected &&
        (pendingTx || !A.account || !B.account || A.account === B.account)
      }
      type="primary"
      size="large">
      {generateActionLabel(CREATE_POOL_LABEL, connected, env, A, B)}
      {pendingTx && <Spin indicator={antIcon} className="add-spinner" />}
    </Button>
  ) : (
      <Dropdown.Button
        className="add-button"
        onClick={executeAction}
        disabled={
          connected &&
          (pendingTx || !A.account || !B.account || A.account === B.account)
        }
        type="primary"
        size="large"
        overlay={<PoolConfigCard options={options} setOptions={setOptions} />}
      >
        {generateActionLabel(CREATE_POOL_LABEL, connected, env, A, B)}
        {pendingTx && <Spin indicator={antIcon} className="add-spinner" />}
      </Dropdown.Button>
    );

  return (
    <div>
      <Popover
        trigger="hover"
        content={
          <div style={{ width: 300 }}>
            Liquidity providers earn a fixed percentage fee on all trades
            proportional to their share of the pool. Fees are added to the pool,
            accrue in real time and can be claimed by withdrawing your
            liquidity.
          </div>
        }
      >
        <Button type="text">Read more about providing liquidity.</Button>
      </Popover>

      <CurrencyInput
        title="Input"
        onInputChange={(val: any) => {
          if (A.amount !== val) {
            setLastTypedAccount(A.mintAddress);
          }
          A.setAmount(val);
        }}
        amount={A.amount}
        mint={A.mintAddress}
        onMintChange={(item) => {
          A.setMint(item);
        }}
      />
      <div>+</div>
      <CurrencyInput
        title="Input"
        onInputChange={(val: any) => {
          if (B.amount !== val) {
            setLastTypedAccount(B.mintAddress);
          }

          B.setAmount(val);
        }}
        amount={B.amount}
        mint={B.mintAddress}
        onMintChange={(item) => {
          B.setMint(item);
        }}
      />
      <SupplyOverview
        mintAddress={[A.mintAddress, B.mintAddress]}
        pool={pool}
      />
      {pool && (
        <Button
          className="add-button"
          type="primary"
          size="large"
          onClick={executeAction}
          disabled={
            connected &&
            (pendingTx ||
              !A.account ||
              !B.account ||
              A.account === B.account ||
              !hasSufficientBalance)
          }
        >
          {generateActionLabel(ADD_LIQUIDITY_LABEL, connected, env, A, B)}
          {pendingTx && <Spin indicator={antIcon} className="add-spinner" />}
        </Button>
      )}
      {!pool && createPoolButton}
    </div>
  );
};
