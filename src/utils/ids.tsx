import { PublicKey } from "@solana/web3.js";

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
let TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');  

let SWAP_PROGRAM_ID: PublicKey;

export const PROGRAM_IDS = [
    {
        name: 'mainnet-beta',
        swap: () => new PublicKey('HYv7pNgHkkBGxfrnCre2pMgLpWm7LJPKxiyZVytN5HrM')
    },
    {
        name: 'testnet',
        swap: () => new PublicKey('CrRvVBS4Hmj47TPU3cMukurpmCUYUrdHYxTQBxncBGqw')
    },
    {
        name: 'devnet',
        swap: () => new PublicKey('EEuPz4iZA5reBUeZj6x1VzoiHfYeHMppSCnHZasRFhYo')
    },
    {
        name: 'localnet',
        swap: () => {
            // TODO: query from local config
            return new PublicKey('AA6zS5gndVnu2SJ7PYFJpj9UaEU7kGfE8Rhcwju27HdF');
        }
    },
];

export const setProgramIds = (envName: string) => {
    let instance = PROGRAM_IDS.find(env => env.name === envName);
    if (!instance) {
        return;
    }

    SWAP_PROGRAM_ID = instance.swap();
}

export const programIds = () => {
    return {
        token: TOKEN_PROGRAM_ID,
        swap: SWAP_PROGRAM_ID,
    };
}