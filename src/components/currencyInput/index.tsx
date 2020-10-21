import React, { useEffect, useState } from 'react';
import { calculateDependentAmount, usePoolForBasket } from './../../utils/pools';
import { Card, Select, } from 'antd';
import { NumericInput } from './../numericInput';
import { getTokenName, isKnownMint, KnownToken } from './../../utils/utils';
import { useUserAccounts, useMint, useSelectedAccount, useAccountByMint } from './../../utils/accounts';
import './styles.less';
import { MintInfo } from '@solana/spl-token';
import { useConnection, useConnectionConfig } from './../../utils/connection';
import { Identicon } from './../identicon';
import PopularTokens from './../../utils/token-list.json';

const { Option } = Select;

const TokenIcon = (props:{ mintAddress: string, icon?: string }) => {
    if(props.icon) {
        return <img key={props.mintAddress} width="20" height="20" src={props.icon} style={{ marginRight: '0.5rem', borderRadius: '1rem', backgroundColor: 'white', backgroundClip:'padding-box' }} />
    }

    return <Identicon address={props.mintAddress} style={{ marginRight: '0.5rem' }} />;
}

export const useCurrencyPairState = () => {
    const connection = useConnection();
    const [amountA, setAmountA] = useState("");
    const [amountB, setAmountB] = useState("");
    const [mintAddressA, setMintAddressA] = useState("");
    const [mintAddressB, setMintAddressB] = useState("");
    const [lastTypedAccount, setLastTypedAccount] = useState('');
    const accountA = useAccountByMint(mintAddressA);
    const accountB = useAccountByMint(mintAddressB);
    const mintA = useMint(mintAddressA);
    const mintB = useMint(mintAddressB);
    const pool = usePoolForBasket([mintAddressA, mintAddressB]);

    const calculateDependent = async () => {
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
    
                const result = await calculateDependentAmount(connection, independent, amount, pool);
                if (result !== undefined && Number.isFinite(result)) {
                    setDependent(result.toFixed(2));
                } else {
                    setDependent('');
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
            mintAddress: mintAddressA,
            account: accountA,
            mint: mintA,
            amount: amountA,
            setAmount: setAmountA,
            setMint: setMintAddressA,
            convertAmount: () => convertAmount(amountA, mintA),
        },
        B: {
            mintAddress: mintAddressB,
            account: accountB,
            mint: mintB,
            amount: amountB,
            setAmount: setAmountB,
            setMint: setMintAddressB,
            convertAmount: () => convertAmount(amountB, mintB),
        },
        setLastTypedAccount,  
    };
}

export const CurrencyInput = (props: {
    mint?: string,
    amount?: string,
    title?: string,
    onInputChange?: (val: number) => void,
    onMintChange?: (account: string) => void,
}) => {
    const { userAccounts } = useUserAccounts();
    const mint = useMint(props.mint);

    const { env } = useConnectionConfig();

    const tokens = PopularTokens[env] as KnownToken[];

    const renderPopularTokens = tokens.map(item => {
        return <Option value={item.mintAddress} title={item.mintAddress}>
            <div key={item.mintAddress} style={{ display: 'flex', alignItems: 'center' }} >
                <TokenIcon mintAddress={item.mintAddress} icon={item.icon} />
                {item.tokenSymbol}
            </div>
        </Option>
    });

    const renderAdditionalTokens = userAccounts.map(account => {
        const mint = account.info.mint.toBase58();
        if(isKnownMint(env, mint)) {
            return null;
        }

        return <Option value={mint} title={mint}>
            <div key={mint} style={{ display: 'flex', alignItems: 'center', opacity: 0.6 }} >
                <TokenIcon mintAddress={mint} />
                {getTokenName(env, mint)}
            </div>
        </Option>
    });

    const userUiBalance = () => {
        const currentAccount = userAccounts?.find(a => a.info.mint.toBase58() === props.mint);
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
                <Select size="large"  style={{ minWidth: 80 }} placeholder="CCY" value={props.mint}  
                dropdownMatchSelectWidth={true}
                dropdownStyle={{ minWidth: 120 }} 
                onChange={(item) => {
                    if (props.onMintChange) {
                        props.onMintChange(item);
                    }
                }}>{[...renderPopularTokens, ...renderAdditionalTokens]}</Select>
            </div>
        </div>
    </Card>);
};