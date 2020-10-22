import { PublicKey } from "@solana/web3.js";

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
let TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');  

let SWAP_PROGRAM_ID: PublicKey;
let SWAP_PROGRAM_LEGACY_IDS: PublicKey[];

// legacy pools are used to show users contributions in those pools to allow for withdrawals of funds

export const PROGRAM_IDS = [
    {
        name: 'mainnet-beta',
        swap: () => ({
            current: new PublicKey('HYv7pNgHkkBGxfrnCre2pMgLpWm7LJPKxiyZVytN5HrM'),
            legacy: [
            ],
        })
    },
    {
        name: 'testnet',
        swap: () => ({
            current: new PublicKey('CrRvVBS4Hmj47TPU3cMukurpmCUYUrdHYxTQBxncBGqw'),
            legacy: [
            ],
        })
    },
    {
        name: 'devnet',
        swap: () => ({
            current: new PublicKey('CMoteLxSPVPoc7Drcggf3QPg3ue8WPpxYyZTg77UGqHo'),
            legacy: [
                new PublicKey('EEuPz4iZA5reBUeZj6x1VzoiHfYeHMppSCnHZasRFhYo')
            ],
        })
    },
    {
        name: 'localnet',
        swap: () => ({
            current: new PublicKey('5rdpyt5iGfr68qt28hkefcFyF4WtyhTwqKDmHSBG8GZx'),
            legacy: [
            ],
        })
    },
];

export const setProgramIds = (envName: string) => {
    let instance = PROGRAM_IDS.find(env => env.name === envName);
    if (!instance) {
        return;
    }

    let swap = instance.swap();

    SWAP_PROGRAM_ID = swap.current;
    SWAP_PROGRAM_LEGACY_IDS = swap.legacy;
}

export const programIds = () => {
    return {
        token: TOKEN_PROGRAM_ID,
        swap: SWAP_PROGRAM_ID,
        swap_legacy: SWAP_PROGRAM_LEGACY_IDS,
    };
}
