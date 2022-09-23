import { Shopify } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import express from "express";
const app = express();

app.post("/orders", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const order = new Order({ session: test_session });

    order.line_items = [
      {
        variant_id: req.body.variant_id,
        quantity: req.body.quantity,
        price: req.body.price,
      },
    ];
    console.log(order);
    const orderCreted = await order.save({});
    res.status(200).send(orderCreted);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/orders", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    const allOrder = await Order.all({
      session: test_session,
      status: "any",
    });
    res.status(200).send(allOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/orders/:id", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const deleteOrder = await Order.delete({
      session: test_session,
      id: req.params.id,
    });
    res.status(200).send(deleteOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/orders/:id", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    console.log("update id", req.params.id);

    const order = new Order({ session: test_session });
    order.id = req.params.id;
    order.line_items = [
      {
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
      },
    ];
    console.log("items", order);

    const updatedata = await order.save({});
    res.status(200).send(updatedata);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default app;
