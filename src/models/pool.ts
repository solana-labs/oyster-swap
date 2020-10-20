import { PublicKey } from "@solana/web3.js";
import { TokenAccount } from "./account";

export interface PoolInfo {
    pubkeys: {
        program: PublicKey;
        accounts: PublicKey[];
        accountMints: PublicKey[];
        mint: PublicKey;
    };
    raw: any;
}


export interface LiquidityComponent {
    amount: number;
    account: TokenAccount;
}