import { HashRouter, Route } from "react-router-dom";
import React from "react";
import { ExchangeView } from "./components/exchange";
import { ChartsView } from "./components/charts";

export function Routes() {
  // TODO: add simple view for sharing ...
  return (
    <>
      <HashRouter basename={"/"}>
        <Route exact path="/" component={ExchangeView} />
        <Route exact path="/info" component={ChartsView} />
      </HashRouter>
    </>
  );
}
