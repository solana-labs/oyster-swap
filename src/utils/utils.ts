import { useCallback, useState } from "react";
import { MintInfo } from "@solana/spl-token";

import PopularTokens from "./token-list.json";
import { ENV } from "./connection";
import { PoolInfo, TokenAccount } from "./../models";

export interface KnownToken {
  tokenSymbol: string;
  tokenName: string;
  icon: string;
  mintAddress: string;
}

const AddressToToken = Object.keys(PopularTokens).reduce((map, key) => {
  const tokens = PopularTokens[key as ENV] as KnownToken[];
  const knownMints = tokens.reduce((map, item) => {
    map.set(item.mintAddress, item);
    return map;
  }, new Map<string, KnownToken>());

  map.set(key as ENV, knownMints);

  return map;
}, new Map<ENV, Map<string, KnownToken>>());

export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `0x${address.substring(0, chars)}...${address.substring(44 - chars)}`;
}

export function getTokenName(env: ENV, mintAddress: string): string {
  const knownSymbol = AddressToToken.get(env)?.get(mintAddress)?.tokenSymbol;
  if (knownSymbol) {
    return knownSymbol;
  }

  return shortenAddress(mintAddress).substring(10).toUpperCase();
}

export function getTokenIcon(
  env: ENV,
  mintAddress: string
): string | undefined {
  return AddressToToken.get(env)?.get(mintAddress)?.icon;
}

export function getPoolName(env: ENV, pool: PoolInfo) {
  const sorted = pool.pubkeys.holdingMints.map((a) => a.toBase58()).sort();
  return sorted.map((item) => getTokenName(env, item)).join("/");
}

export function isKnownMint(env: ENV, mintAddress: string) {
  return !!AddressToToken.get(env)?.get(mintAddress);
}

export const STABLE_COINS = new Set(["USDC", "wUSDC", "USDT"]);

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size))
}

export function convert(
  account?: TokenAccount,
  mint?: MintInfo,
  rate: number = 1.0
): number {
  if (!account) {
    return 0;
  }

  const precision = Math.pow(10, mint?.decimals || 0);
  return (account.info.amount?.toNumber() / precision) * rate;
}

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const abbreviateNumber = (number: number, precision: number) => {
  let tier = Math.log10(number) / 3 | 0;
  let scaled = number;
  let suffix = SI_SYMBOL[tier];
  if (tier !== 0) {
    let scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }

  return scaled.toFixed(precision) + suffix;
}

export function formatTokenAmount(
  account?: TokenAccount,
  mint?: MintInfo,
  rate: number = 1.0,
  prefix = "",
  suffix = ""
): string {
  if (!account) {
    return "";
  }

  return `${[prefix]}${abbreviateNumber(convert(account, mint, rate), 6)}${suffix}`;
}
