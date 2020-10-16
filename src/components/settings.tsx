import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import { useWallet, WALLET_PROVIDERS } from '../utils/wallet';
import { NumericInput } from './numericInput';

const Slippage = (props: {}) => {
  const [value, setValue] = useState<number>();
  const [manualValue, setManualValue] = useState('');

  const isSelected = (val: number) => {
    return val === value ? 'primary' : 'default';
  }

  const itemStyle: React.CSSProperties ={
    margin: 5
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {[0.1, 0.5, 1.0].map(item => {
        return <Button key={item.toString()} style={itemStyle} type={isSelected(item)} onClick={() => setValue(item)} >{item}%</Button>
      })}
      <NumericInput className="slippage-input" size="small" placeholder={value} value={manualValue} 
                    style={{ width: 200, fontSize: 20, boxShadow: 'none', borderColor: 'transparent', outline: 'transpaernt' }}
                    onChange={(x: any) => setManualValue(x)} />%
    </div>
  )
}

export const Settings = () => {
    const { providerUrl, setProvider } = useWallet();
    const { endpoint, setEndpoint } = useConnectionConfig();

    return <>
        <div>
          
          <div>
            Transactions: Settings:
            <div>
              Slippage:
              <Slippage />
            </div>

          </div>

      Network: <Select
        onSelect={setEndpoint}
        value={endpoint}
        style={{ marginRight: 8 }}
      >
        {ENDPOINTS.map(({ name, endpoint }) => (
          <Select.Option value={endpoint} key={endpoint}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </div>
    <div>
      Wallet: <Select onSelect={setProvider} value={providerUrl}>
        {WALLET_PROVIDERS.map(({ name, url }) => (
          <Select.Option value={url} key={url}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </div>
    </>;
}