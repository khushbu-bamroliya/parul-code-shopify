import React from "react";
import { Router, Switch, BrowserRouter } from "react-router-dom";
import { HomePage } from "./HomePage";
import Product from "./Product";
const Navigation = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Router exec path="/" component={HomePage}></Router>
          <Router exec path="/product" component={Product}></Router>
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
