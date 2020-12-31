import "./App.css";
import { CityPage } from "./pages/city/CityPage";
import { HashRouter, Switch, Route } from "react-router-dom";
import React from "react";
import { HomePage } from "./pages/home/HomePage";

export const App = () => {
  return (
    <div className="App">
      <HashRouter basename='/'>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/city/:cityid">
            <CityPage />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
};
