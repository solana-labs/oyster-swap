import React, {  } from 'react';
import { Card } from 'antd';
import { getTokenName, formatTokenAmount } from '../../utils/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { useMint, useAccount } from '../../utils/accounts';
import { useConnectionConfig } from '../../utils/connection';
import { PoolInfo } from '../../models';


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: any, data: any) => {
  const {cx, cy, midAngle, innerRadius, outerRadius, index} = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#FFFFFF" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {data[index].name}
    </text>
  );
};

export const SupplyOverview = (props: { pool?: PoolInfo }) => {
    const { pool } = props;
    const mintA = useMint(pool?.pubkeys.accountMints[0].toBase58());
    const mintB = useMint(pool?.pubkeys.accountMints[1].toBase58());
    const accountA = useAccount(pool?.pubkeys.accounts[0]);
    const accountB = useAccount(pool?.pubkeys.accounts[1]);
    const { env } = useConnectionConfig();
    
    if (!pool || !accountA || !accountB ) {
        return null;
    }

    const data = [
        {
            name: getTokenName(env, pool?.pubkeys.accountMints[0].toBase58()),
            value: accountA?.info.amount?.toNumber(),
            color: '#6610f2'

        },
        {
            name: getTokenName(env, pool?.pubkeys.accountMints[1].toBase58()),
            value: accountB?.info.amount?.toNumber(),
            color: '#d83aeb'
        }
    ];

    return (<Card style={{ borderWidth: 0 }}>
        <div style={{ display: 'flex' }}>
            <PieChart width={150} height={150}>
                <Pie dataKey="value"
                    isAnimationActive={false}
                    data={data}
                    labelLine={false}
                    cx={70}
                    cy={70}
                    label={(props) => renderCustomizedLabel(props, data)}
                    outerRadius={60}
                >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} stroke="" fill={entry.color} />)}
                </Pie>
            </PieChart>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, flex: '1 1', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div>{data[0].name}: {formatTokenAmount(accountA, mintA)}</div>
                <div>{data[1].name}: {formatTokenAmount(accountB, mintB)}</div>
            </div>
        </div>
    </Card>);
}