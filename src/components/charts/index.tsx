import React, { useState } from "react";
import { Button, Card, Popover } from "antd";
import { TradeEntry } from "./../trade";
import { AddToLiquidity } from "./../pool/add";
import { useWallet } from "./../../utils/wallet";
import { AppBar } from './../appBar';

export const ChartsView = (props: {}) => {
  const { connected, wallet } = useWallet();

  return (
    <>
      <AppBar />
      TODO
    </>
  );
};
