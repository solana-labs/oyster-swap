import React, { useEffect, useState } from 'react';
import { calculateDependentAmount, usePoolForBasket } from '../utils/pools';
import { Card, Select, } from 'antd';
import { NumericInput } from './numericInput';
import { getTokenName } from '../utils/utils';
import { useUserAccounts, useMint, useSelectedAccount } from '../utils/accounts';
import './currencyInput.less';
import { MintInfo } from '@solana/spl-token';
import { useConnection } from '../utils/connection';
import { Identicon } from './identicon';

const { Option } = Select;

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
    const currentAccount = userAccounts?.find(a => a.pubkey.toBase58() === props.account);
    const currentMintAddress = currentAccount?.info.mint.toBase58();
    const mint = useMint(currentMintAddress);

    // TODO: combine with predefined token list
    const items = userAccounts.map(account => {
        return <Option value={account.pubkey.toBase58()} title={account.info.mint.toBase58()}>
            {/* {data && <img key={props.account} width="20" height="20" src={`data:image/png;base64,${data}`} />} */}
            {getTokenName(account.info.mint.toBase58())}
        </Option>
    });

    const userUiBalance = () => {
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
                <Identicon address={currentMintAddress} />
                <Select size="large"  style={{ width: '100%' }} placeholder="CCY" value={props.account}   
                onChange={(item) => {
                    if (props.onAccountChange) {
                        props.onAccountChange(item);
                    }
                }}>{items}</Select>
            </div>
        </div>
    </Card>);
};