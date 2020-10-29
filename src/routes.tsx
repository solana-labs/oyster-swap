import { BrowserRouter, HashRouter, Route } from "react-router-dom";
import React from "react";
import { ExchangeView } from "./components/exchange";
import { ChartsView } from "./components/charts";

import { WalletProvider } from "./utils/wallet";
import { ConnectionProvider } from "./utils/connection";
import { AccountsProvider } from "./utils/accounts";
import { CurrencyPairProvider } from "./utils/currencyPair";

export function Routes() {
  return (
    <>
      <HashRouter basename={"/"}>
        <ConnectionProvider>
          <WalletProvider>
            <AccountsProvider>
              <CurrencyPairProvider>
                <Route exact path="/" component={ExchangeView} />
                <Route exact path="/info" component={ChartsView} />
              </CurrencyPairProvider>
            </AccountsProvider>
          </WalletProvider>
        </ConnectionProvider>
      </HashRouter>
    </>
  );
}
