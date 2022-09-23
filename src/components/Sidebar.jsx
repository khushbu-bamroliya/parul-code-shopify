import React from "react";
import { Frame, Navigation } from "@shopify/polaris";
import { HomeMinor, OrdersMinor, ProductsMinor } from "@shopify/polaris-icons";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      {/* <Frame> */}
        <Navigation location="/">
          <Navigation.Section
            items={[
              {
                url: "/",
                label: "Home",
                icon: HomeMinor,
              },
              {
                url: "/path/to/place",
                label: "Orders",
                icon: OrdersMinor,
                badge: "15",
              },
              {
                url: "/product",
                label: "Products",
                icon: ProductsMinor,
              },
            ]}
          />
        </Navigation>
      {/* </Frame> */}
    </>
  );
};

export default Sidebar;
