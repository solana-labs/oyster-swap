import { useCallback, useState } from 'react';
import { MintInfo } from '@solana/spl-token';

import PopularTokens from './token-list.json';
import { ENV } from './connection';
import { PoolInfo, TokenAccount } from './../models';


export interface KnownToken {
  tokenSymbol: string;
  tokenName: string;
  icon: string;
  mintAddress: string;
}

const AddressToToken = Object.keys(PopularTokens).reduce((map, key) => {
  const tokens = PopularTokens[key as ENV] as KnownToken[];
  const knownMints = tokens.reduce((map,item) =>{
      map.set(item.mintAddress, item);
      return map;
  }, new Map<string, KnownToken>()) ;

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
      [state, key],
    );
  
    return [state, setLocalStorageState];
  }

  // shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `0x${address.substring(0, chars)}...${address.substring(44 - chars)}`
}

export function getTokenName(env: ENV, mintAddress: string): string {
  const knownSymbol = AddressToToken.get(env)?.get(mintAddress)?.tokenSymbol;
  if(knownSymbol) {
    return knownSymbol;
  }

  // TODO: implement
  return shortenAddress(mintAddress).substring(10).toUpperCase();
}

export function getPoolName(env: ENV, pool: PoolInfo) {
  const sorted = pool.pubkeys.accountMints.sort();

  debugger;
  return sorted.map(item => getTokenName(env, item.toBase58())).join('/');
}

export function isKnownMint(env: ENV, mintAddress: string) {
  return !!AddressToToken.get(env)?.get(mintAddress);
}

export function formatTokenAmount(account?: TokenAccount, mint?: MintInfo): string {
  if(!account) {
    return '';
  }

  const precision = Math.pow(10, (mint?.decimals || 0));
  return (account.info.amount?.toNumber() / precision)?.toString();
}