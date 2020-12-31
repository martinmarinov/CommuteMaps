import "./App.css";
import { CityPage } from "./pages/city/CityPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import { HomePage } from "./pages/home/HomePage";

export const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/city/:cityid">
            <CityPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
