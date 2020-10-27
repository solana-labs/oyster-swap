import { Identicon } from "./../identicon";
import React from "react";
import { getTokenIcon } from "../../utils/utils";
import { useConnectionConfig } from "../../utils/connection";

export const TokenIcon = (props: {
  mintAddress: string;
  style?: React.CSSProperties;
}) => {
  const { env } = useConnectionConfig();
  const icon = getTokenIcon(env, props.mintAddress);

  if (icon) {
    return (
      <img
        alt="Token icon"
        key={props.mintAddress}
        width="20"
        height="20"
        src={icon}
        style={{
          marginRight: "0.5rem",
          marginTop: "0.11rem",
          borderRadius: "1rem",
          backgroundColor: "white",
          backgroundClip: "padding-box",
          ...props.style,
        }}
      />
    );
  }

  return (
    <Identicon
      address={props.mintAddress}
      style={{ marginRight: "0.5rem", ...props.style }}
    />
  );
};

export const PoolIcon = (props: {
  mintA: string;
  mintB: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div style={{ display: "flex" }}>
      <TokenIcon
        mintAddress={props.mintA}
        style={{ marginRight: "-0.5rem", ...props.style }}
      />
      <TokenIcon mintAddress={props.mintB} />
    </div>
  );
};
