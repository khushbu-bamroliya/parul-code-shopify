import { FooterHelp, Link } from "@shopify/polaris";
import React from "react";

const Footer = () => {
  return (
    <>
      <FooterHelp>
        Learn more about{" "}
        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
          fulfilling orders
        </Link>
      </FooterHelp>
    </>
  );
};

export default Footer;
