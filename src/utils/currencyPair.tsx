import React, { useCallback, useContext, useEffect, useState } from "react";
import { calculateDependentAmount, usePoolForBasket } from "./pools";
import { useMint, useAccountByMint } from "./accounts";
import { MintInfo } from "@solana/spl-token";
import { useConnection } from "./connection";
import { TokenAccount } from "../models";
import { convert } from "./utils";

export interface CurrencyContextState {
  mintAddress: string;
  account?: TokenAccount;
  mint?: MintInfo;
  amount: string;
  setAmount: (val: string) => void;
  setMint: (mintAddress: string) => void;
  convertAmount: () => number;
  sufficientBalance: () => boolean;
}

export interface CurrencyPairContextState {
  A: CurrencyContextState;
  B: CurrencyContextState;
  setLastTypedAccount: (mintAddress: string) => void;
}

const CurrencyPairContext = React.createContext<CurrencyPairContextState | null>(
  null
);

export function CurrencyPairProvider({ children = null as any }) {
  const connection = useConnection();
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [mintAddressA, setMintAddressA] = useState("");
  const [mintAddressB, setMintAddressB] = useState("");
  const [lastTypedAccount, setLastTypedAccount] = useState("");
  const accountA = useAccountByMint(mintAddressA);
  const accountB = useAccountByMint(mintAddressB);
  const mintA = useMint(mintAddressA);
  const mintB = useMint(mintAddressB);
  const pool = usePoolForBasket([mintAddressA, mintAddressB]);

  const calculateDependent = useCallback(async () => {
    if (pool && mintAddressA && mintAddressB) {
      let setDependent;
      let amount;
      let independent;
      if (lastTypedAccount === mintAddressA) {
        independent = mintAddressA;
        setDependent = setAmountB;
        amount = parseFloat(amountA);
      } else {
        independent = mintAddressB;
        setDependent = setAmountA;
        amount = parseFloat(amountB);
      }

      const result = await calculateDependentAmount(
        connection,
        independent,
        amount,
        pool
      );
      if (result !== undefined && Number.isFinite(result)) {
        setDependent(result.toFixed(2));
      } else {
        setDependent("");
      }
    }
  }, [
    pool,
    mintAddressA,
    mintAddressB,
    setAmountA,
    setAmountB,
    amountA,
    amountB,
    connection,
    lastTypedAccount,
  ]);

  useEffect(() => {
    calculateDependent();
  }, [amountB, amountA, lastTypedAccount, calculateDependent]);

  const convertAmount = (amount: string, mint?: MintInfo) => {
    return parseFloat(amount) * Math.pow(10, mint?.decimals || 0);
  };

  return (
    <CurrencyPairContext.Provider
      value={{
        A: {
          mintAddress: mintAddressA,
          account: accountA,
          mint: mintA,
          amount: amountA,
          setAmount: setAmountA,
          setMint: setMintAddressA,
          convertAmount: () => convertAmount(amountA, mintA),
          sufficientBalance: () =>
            accountA !== undefined &&
            convert(accountA, mintA) >= parseFloat(amountA),
        },
        B: {
          mintAddress: mintAddressB,
          account: accountB,
          mint: mintB,
          amount: amountB,
          setAmount: setAmountB,
          setMint: setMintAddressB,
          convertAmount: () => convertAmount(amountB, mintB),
          sufficientBalance: () =>
            accountB !== undefined &&
            convert(accountB, mintB) >= parseFloat(amountB),
        },
        setLastTypedAccount,
      }}
    >
      {children}
    </CurrencyPairContext.Provider>
  );
}

export const useCurrencyPairState = () => {
  const context = useContext(CurrencyPairContext);
  return context as CurrencyPairContextState;
};
