import { Button, Spin } from 'antd';
import React, { useState } from 'react';
import { useConnection } from '../../utils/connection';
import { useWallet } from '../../utils/wallet';
import { CurrencyInput, useCurrencyPairState } from './../currencyInput';
import { LoadingOutlined } from '@ant-design/icons';
import { swap, usePoolForBasket } from '../../utils/pools';
import { notify } from '../../utils/notifications';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// TODO:
// Compute price breakdown with/without fee
// Show slippage

export const TradeEntry = () => {
    const { wallet } = useWallet();
    const connection = useConnection();
    const [pendingTx, setPendingTx] = useState(false);
    const { A, B, setLastTypedAccount } = useCurrencyPairState();
    const pool = usePoolForBasket([A?.account?.info.mint.toBase58(), B?.account?.info.mint.toBase58()]);

    const handleSwap = async () => {
        if (A.account && B.account && A.mint && B.mint) {
            try {
                setPendingTx(true);

                const components = [
                    {
                        account: A.account,
                        amount: A.convertAmount()
                    },
                    {
                        account: B.account,
                        amount: B.convertAmount()
                    }
                ];

                await swap(connection, wallet, components, pool);

            } catch {
                notify({
                    description: 'Please try again and approve transactions from your wallet',
                    message: 'Swap trade cancelled.',
                    type: 'error'
                })
            } finally {
                // TODO: refresh accounts
                setPendingTx(false);
            }
        }
    };

    return <>
        <div>
            <CurrencyInput
                title="Input"
                onInputChange={(val: any) => {
                    if (A.amount !== val) {
                        setLastTypedAccount(A.address);
                    }

                    A.setAmount(val);
                }}
                amount={A.amount}
                account={A.address}
                onAccountChange={(item) => {
                    A.setAddress(item);
                }}
            />
            <div>↓</div>
            <CurrencyInput
                title="To"
                onInputChange={(val: any) => {
                    if (B.amount !== val) {
                        setLastTypedAccount(B.address);
                    }

                    B.setAmount(val);
                }}
                amount={B.amount}
                account={B.address}
                onAccountChange={(item) => {
                    B.setAddress(item);
                }}
            />
        </div>
        <Button type="primary" size="large" onClick={handleSwap} style={{ width: '100%' }}
            disabled={pendingTx || A.address === '' || B.address === ''}>
            Swap
            {pendingTx && <Spin indicator={antIcon} />}
        </Button>
    </>;
}