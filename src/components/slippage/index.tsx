import React, { useEffect, useState } from "react";
import { Button } from "antd";
import {
  useSlippageConfig,
} from "./../../utils/connection";
import { NumericInput } from "./../numericInput";

export const Slippage = () => {
  const { slippage, setSlippage } = useSlippageConfig();
  const slippagePct = slippage * 100;
  const [value, setValue] = useState(slippagePct.toString());

  useEffect(() => {
    setValue(slippagePct.toString());
  }, [slippage, slippagePct]);

  const isSelected = (val: number) => {
    return val === slippagePct ? "primary" : "default";
  };

  const itemStyle: React.CSSProperties = {
    margin: 5,
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {[0.1, 0.5, 1.0].map((item) => {
        return (
          <Button
            key={item.toString()}
            style={itemStyle}
            type={isSelected(item)}
            onClick={() => setSlippage(item / 100.0)}
          >
            {item}%
          </Button>
        );
      })}
      <div style={{ padding: "3px 10px 3px 3px", border: "1px solid #434343" }}>
        <NumericInput
          className="slippage-input"
          size="small"
          placeholder={value}
          value={value}
          style={{
            width: 50,
            fontSize: 14,
            boxShadow: "none",
            borderColor: "transparent",
            outline: "transpaernt",
          }}
          onChange={(x: any) => {
            setValue(x);
            const newValue = parseFloat(x) / 100.0;
            if (Number.isFinite(newValue)) {
              setSlippage(newValue);
            }
          }}
        />
        %
      </div>
    </div>
  );
};
