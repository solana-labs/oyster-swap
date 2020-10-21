import { Identicon } from './../identicon';
import React from "react";
import { getTokenIcon } from '../../utils/utils';
import { useConnectionConfig } from '../../utils/connection';

export const TokenIcon = (props: { mintAddress: string, style?: React.CSSProperties }) => {
    const { env } = useConnectionConfig();
    const icon = getTokenIcon(env, props.mintAddress)

    if (icon) {
        return <img
            key={props.mintAddress}
            width="20"
            height="20"
            src={icon}
            style={{
                marginRight: '0.5rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                backgroundClip: 'padding-box',
                ...props.style,
            }} />
    }

    return <Identicon address={props.mintAddress} style={{ marginRight: '0.5rem' }} />;
}
