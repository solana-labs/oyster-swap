import { ENV } from "../utils/connection";
import { CurrencyContextState } from "../utils/currencyPair";
import { getTokenName } from "../utils/utils";

export const CREATE_POOL_LABEL = "Create Liquidity Pool";
export const INSUFFICIENT_FUNDS_LABEL = (tokenName: string) =>
  `Insufficient ${tokenName} funds`;
export const POOL_NOT_AVAILABLE = (tokenA: string, tokenB: string) =>
  `Pool ${tokenA}/${tokenB} doesn't exsist`;
export const ADD_LIQUIDITY_LABEL = "Provide Liquidity";
export const SWAP_LABEL = "Swap";
export const CONNECT_LABEL = "Connect Wallet";
export const SELECT_TOKEN_LABEL = "Select a token";
export const ENTER_AMOUNT_LABEL = "Enter an amount";

export const generateActionLabel = (
  action: string,
  connected: boolean,
  env: ENV,
  A: CurrencyContextState,
  B: CurrencyContextState,
  ignoreToBalance: boolean = false
) => {
  return !connected
    ? CONNECT_LABEL
    : !A.mintAddress
    ? SELECT_TOKEN_LABEL
    : !A.amount
    ? ENTER_AMOUNT_LABEL
    : !B.mintAddress
    ? SELECT_TOKEN_LABEL
    : !B.amount
    ? ENTER_AMOUNT_LABEL
    : !A.sufficientBalance()
    ? INSUFFICIENT_FUNDS_LABEL(getTokenName(env, A.mintAddress))
    : ignoreToBalance || B.sufficientBalance()
    ? action
    : INSUFFICIENT_FUNDS_LABEL(getTokenName(env, B.mintAddress));
};
