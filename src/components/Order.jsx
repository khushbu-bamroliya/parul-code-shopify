import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { Button, FormLayout, TextField } from "@shopify/polaris";
import axios from "axios";
import React, { useState } from "react";
import "./order.css";
let vvid = 0;
const Order = () => {
  const app = useAppBridge();
  const [input, setinput] = useState({
    quantity: "",
    price: "",
  });

  console.log("vvid", vvid);

  const inputEvent = (e, key) => {
    setinput({ ...input, [key]: e });
  };

  const createOrder = async () => {
    const token = await getSessionToken(app);
    const data = {
      variant_id: vvid,
      quantity: input.quantity,
      price: input.price,
    };
    console.log("order data", data);

    const res = await axios.post(
      "/api/orders",
      {
        variant_id: vvid,
        quantity: input.quantity,
        price: input.price,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("create order    :b ", res);
  };

  return (
    <div className="main">
      <ResourcePicker
        resourceType="Product"
        onSelection={(SelectPayload) => {
          vvid = SelectPayload.selection[0].variants[0].id.split("/")[4];
          //   setvariant_id(
          //     SelectPayload.selection[0].variants[0].id.split("/")[4]
          //   );
          //   console.log(
          //     "SelectPayload",
          //     SelectPayload.selection[0].variants[0].id.split("/")[4]
          //   );
        }}
        open
      />
      {/* <ResourcePicker/> */}
      <FormLayout>
        <TextField
          label="quantity"
          onChange={(e) => {
            inputEvent(e, "quantity");
          }}
          value={input.quantity}
        />
        <TextField
          label="Price"
          onChange={(e) => {
            inputEvent(e, "price");
          }}
          value={input.price}
        />
        <div>
          <Button
            onClick={() => {
              createOrder();
            }}
          >
            Create
          </Button>
        </div>
      </FormLayout>
    </div>
  );
};

export default Order;

import { useAppBridge } from "@shopify/app-bridge-react";
// import React, { useEffect, useState } from "react";
// import { userLoggedInFetch } from "../App";

// const GraphProduct = () => {
//   const [product, setProduct] = useState([]);
//   const app = useAppBridge();
//   const fetch = userLoggedInFetch(app);

//   async function getProduct() {
//     const res = await fetch("/api/products").then((res) => res.json());
//     setProduct(res.products.edges);
//     console.log("data", res.products.edges);
//   }
//   useEffect(() => {
//     getProduct();
//   }, [false]);
//   return (
//     <div style={{ marginTop: "3%" }}>
//       <h2>data</h2>
//       {product.map((e) => {
//         console.log("e", e.node.title);
//         return (
//           <>
//             <h1>{e.node.title}</h1>
//             <h2>{e.node.vendor}</h2>
//             <h2>{e.node.vendor}</h2>
//             <h2>{e.node.vendor}</h2>
//           </>
//         );
//       })}
//     </div>
//   );
// };

// export default GraphProduct;
