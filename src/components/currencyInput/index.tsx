import React, { useEffect, useState } from 'react';
import { calculateDependentAmount, usePoolForBasket } from './../../utils/pools';
import { Card, Select, } from 'antd';
import { NumericInput } from './../numericInput';
import { getTokenName } from './../../utils/utils';
import { useUserAccounts, useMint, useSelectedAccount } from './../../utils/accounts';
import './styles.less';
import { MintInfo } from '@solana/spl-token';
import { useConnection, useConnectionConfig } from './../../utils/connection';
import { Identicon } from './../identicon';
import PopularTokens from './../../utils/token-list.json';

const { Option } = Select;

interface KnownToken {
    tokenSymbol: string;
    tokenName: string;
    icon: string;
    mintAddress: string;
}

const TokenIcon = (props:{ mintAddress: string, icon?: string }) => {
    if(props.icon) {
        return <img key={props.mintAddress} width="20" height="20" src={props.icon} style={{ marginRight: '0.5rem', borderRadius: '1rem', backgroundColor: 'white' }} />
    }

    return <Identicon address={props.mintAddress} style={{ marginRight: '0.5rem' }} />;
}

export const useCurrencyPairState = () => {
    const connection = useConnection();
    const [amountA, setAmountA] = useState("");
    const [amountB, setAmountB] = useState("");
    const [addressA, setAddressA] = useState("");
    const [addressB, setAddressB] = useState("");
    const [lastTypedAccount, setLastTypedAccount] = useState('');
    const accountA = useSelectedAccount(addressA);
    const accountB = useSelectedAccount(addressB);
    const mintA = useMint(accountA && accountA.info.mint.toBase58());
    const mintB = useMint(accountB && accountB.info.mint.toBase58());
    const pool = usePoolForBasket([accountA?.info.mint.toBase58(), accountB?.info.mint.toBase58()]);

    const calculateDependent = async () => {
            if (pool && accountA && accountB) {
                let setDependent;
                let amount;
                let independent;
                if (lastTypedAccount === addressA) {
                    independent = accountA.info.mint.toBase58();
                    setDependent = setAmountB;
                    amount = parseFloat(amountA);
                } else {
                    independent = accountB.info.mint.toBase58();
                    setDependent = setAmountA;
                    amount = parseFloat(amountB);
                }
    
                const result = await calculateDependentAmount(connection, independent, amount, pool);
                if (result !== undefined) {
                    setDependent(result.toFixed(2));
                }
            }
        };

    useEffect(() => {
        calculateDependent();
    }, [amountB, amountA, lastTypedAccount]);

    const convertAmount = (amount: string, mint?: MintInfo) => {
        return parseFloat(amount) * Math.pow(10, mint?.decimals || 0);
    }

    return {
        A: {
            address: addressA,
            account: accountA,
            mint: mintA,
            amount: amountA,
            setAmount: setAmountA,
            setAddress: setAddressA,
            convertAmount: () => convertAmount(amountA, mintA),
        },
        B: {
            address: addressB,
            account: accountB,
            mint: mintB,
            amount: amountB,
            setAmount: setAmountB,
            setAddress: setAddressB,
            convertAmount: () => convertAmount(amountB, mintB),
        },
        setLastTypedAccount,  
    };
}

export const CurrencyInput = (props: {
    account?: string,
    amount?: string,
    title?: string,
    onInputChange?: (val: number) => void,
    onAccountChange?: (account: string) => void,
}) => {
    const { userAccounts } = useUserAccounts();
    const [ selectedMint, setSelectedMint] = useState('');
    const mint = useMint(selectedMint);

    const { env } = useConnectionConfig();

    useEffect(() =>{
        const currentAccount = userAccounts?.find(a => a.pubkey.toBase58() === props.account);
        const currentMintAddress = currentAccount?.info.mint.toBase58();
        //on account change find mint ...
        if(selectedMint !== currentMintAddress && currentMintAddress) {
            setSelectedMint(currentMintAddress);
        }
        
    }, [props.account]);

    const tokens = PopularTokens[env] as KnownToken[];
    const knownMints = tokens.reduce((map,item) =>{
        map.set(item.mintAddress, item);
        return map;
    }, new Map<string, KnownToken>()) ;
    
    const knownMint = knownMints.get(selectedMint);

    const renderPopularTokens = tokens.map(item => {
        // TODO: 

        return <Option value={item.mintAddress} title={item.mintAddress}>
            <div key={item.mintAddress} style={{ display: 'flex', alignItems: 'center' }} >
                <TokenIcon mintAddress={item.mintAddress} icon={item.icon} />
                {item.tokenSymbol}
            </div>
        </Option>
    });

    const renderAdditionalTokens = userAccounts.map(account => {
        const mint = account.info.mint.toBase58();
        if(knownMints.has(mint)) {
            return null;
        }

        return <Option value={mint} title={mint}>
            <div key={mint} style={{ display: 'flex', alignItems: 'center', opacity: 0.6 }} >
                <TokenIcon mintAddress={mint} />
                {getTokenName(mint)}
            </div>
        </Option>
    });

    const userUiBalance = () => {
        const currentAccount = userAccounts?.find(a => a.info.mint.toBase58() === selectedMint);
        if(currentAccount && mint) {
            return currentAccount.info.amount.toNumber() / Math.pow(10, mint.decimals);
        }

        return 0;
    }

    return (<Card className="ccy-input" style={{ borderRadius: 20, margin: 15 }} bodyStyle={{ padding: 0 }} >
        <div className="ccy-input-header">
            <div className="ccy-input-header-left">{props.title}</div>
            
            <div className="ccy-input-header-right">Balance: {userUiBalance().toFixed(2)}</div>
        </div>
        <div className="ccy-input-header" style={{ padding: '0px 10px 5px 7px' }}>
            <NumericInput value={props.amount} onChange={(val: any) => {
                if (props.onInputChange) {
                    props.onInputChange(val);
                }

            }} style={{ fontSize: 20, boxShadow: 'none', borderColor: 'transparent', outline: 'transpaernt' }} placeholder="0.00" />
            
            <div className="ccy-input-header-right" style={{ display: 'felx' }}>
                <Select size="large"  style={{ minWidth: 80 }} placeholder="CCY" value={selectedMint}  
                dropdownMatchSelectWidth={true}
                dropdownStyle={{ minWidth: 120 }} 
                onChange={(item) => {
                    // TODO: match mint to user account ...

                    setSelectedMint(item);
                    const userAccount = userAccounts?.find(a => a.info.mint.toBase58() === item);
                    if (props.onAccountChange && userAccount) {
                        props.onAccountChange(userAccount.pubkey.toBase58());
                    }
                }}>{[...renderPopularTokens, ...renderAdditionalTokens]}</Select>
            </div>
        </div>
    </Card>);
};