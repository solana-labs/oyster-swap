import React, { useState } from 'react';
import { Button } from 'antd';

import { PoolInfo, removeLiquidity } from '../../utils/pools';
import { useWallet } from '../../utils/wallet';
import { useConnection } from '../../utils/connection';
import { TokenAccount } from '../../utils/accounts';

export const RemoveLiquidity = (props: { instance: { account: TokenAccount, pool: PoolInfo } }) => {
    const { account, pool } = props.instance;
    const [pendingTx, setPendingTx] = useState(false);
    const { wallet } = useWallet();
    const connection = useConnection();

    const onRemove = async () => {
        try {
            setPendingTx(true);
            // TODO: calculate percentage based on user input
            let liquidityAmount = account.info.amount.toNumber();
            removeLiquidity(connection, wallet, liquidityAmount, account, pool);
        } finally {
            setPendingTx(false);
            // TODO: force refresh of pool accounts?
        }
    };

    return <>
        <Button type="primary" onClick={onRemove} disabled={pendingTx}>Remove</Button>
    </>;
}