import { Shopify } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import express from "express";
const app = express();

app.get("/customers", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Customer } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const allCustomer = await Customer.all({
      session: test_session,
    });
    res.status(200).send(allCustomer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/customers", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Customer } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const customer = new Customer({ session: test_session });
    customer.first_name = req.body.first_name;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.last_name = req.body.last_name;
    customer.addresses = [
      {
        address1: req.body.address1,
        city: req.body.city,
        country: req.body.country,
      },
    ];
    console.log(customer);
    const customerCreate = await customer.save({});
    res.status(200).send(customerCreate);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/customers/:id", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Customer } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const customer = new Customer({ session: test_session });
    customer.id = req.params.id;
    customer.first_name = req.body.first_name;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.last_name = req.body.last_name;
    customer.addresses = [
      {
        address1: req.body.address1,
        city: req.body.city,
        country: req.body.country,
      },
    ];
    console.log(customer);
    const customerCreate = await customer.save({});
    res.status(200).send(customerCreate);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default app;
