import { Card, Tabs } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import AllOrder from "./AllOrder";
import Customer from "./Customer";
import GraphProduct from "./GraphProduct";
import Product from "./Product";

const Tab = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: 0,
      content: "Product",
      panelID: "all-products-content-1",
    },
    {
      id: 1,
      content: "Customer",
      panelID: "all Customer",
    },
    {
      id: 2,
      content: " All Order",
      panelID: "all Order-1",
    },
  ];
  return (
    <div>
    <br/>
    <Card>
   
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section>
          {selected == 0 && <Product />}
          {selected == 1 && <Customer />}
          {selected == 2 && <AllOrder />}
          {/* {selected == 0 && <GraphProduct />} */}
        </Card.Section>
      </Tabs>
    </Card>
    </div>
  );
};

export default Tab;
