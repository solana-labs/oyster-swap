import { useCallback, useState } from 'react';
import { MintInfo } from '@solana/spl-token';
import { TokenAccount } from './accounts';

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

export function getTokenName(mintAddress: string): string {
  // TODO: implement
  return shortenAddress(mintAddress).substring(10).toUpperCase();
}

export function formatTokenAmount(account?: TokenAccount, mint?: MintInfo): string {
  if(!account) {
    return '';
  }

  const precision = Math.pow(10, (mint?.decimals || 0));
  return (account.info.amount?.toNumber() / precision)?.toString();
}