import { Shopify, ApiVersion } from "@shopify/shopify-api";
import verifyRequest from "../middleware/verify-request.js";
import express from "express";

const app = express();

app.get("/products-count", verifyRequest(app), async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );

  const countData = await Product.count({ session });
  res.status(200).send(countData);
});

app.get(
  "/products",
  (req, res, next) => {
    next();
  },
  verifyRequest(app),
  async (req, res) => {
    try {
      const test_session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        false
      );
      const { Product } = await import(
        `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
      );
      const allproduct = await Product.all({
        session: test_session,
      });
      res.status(200).send(allproduct);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.delete("/products/:id", verifyRequest(app), async (req, res) => {
  const test_session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  // console.log(req.params.id);
  const deleteProduct = await Product.delete({
    session: test_session,
    id: req.params.id,
  });
  res.status(200).send(deleteProduct);
});

app.get("/products/:id", verifyRequest(app), async (req, res) => {
  const test_session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  // console.log(req.params.id);
  const singleproduct = await Product.find({
    session: test_session,
    id: req.params.id,
  });
  res.status(200).send(singleproduct);
});

app.put("/products/:id", verifyRequest(app), async (req, res) => {
  try {
    console.log("req.body", req.body);
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    console.log(req.params.id);
    console.log(req.body);
    const product = new Product({ session: test_session });
    product.id = req.params.id;
    product.title = req.body.title;
    product.vendor = req.body.vendor;
    product.product_type = req.body.product_type;
    product.status = req.body.status;
    console.log(product);
    const updatedata = await product.save({});
    res.status(200).send(updatedata);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/products", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
    console.log(req.body);
    const product = new Product({ session: test_session });
    product.title = req.body.title;
    product.vendor = req.body.vendor;
    product.product_type = req.body.product_type;
    product.status = req.body.status;
    console.log(product);
    const createdata = await product.save({});
    res.status(200).send(createdata);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/graphql/getdata", verifyRequest(app), async (req, res) => {
  console.log("hello");
  try {
    const cursor = req.query?.cursor;
    const haspage = req.query?.haspage;
    const quary = req.query?.quary;
    const sortkey = req.query?.sortkey;
    console.log("sortkey", sortkey);
    let infoUrl = "";
    let pageNo = 3;
    if (haspage == 1) {
      infoUrl = `{
        products(first:${pageNo},after:${
        cursor ? `"${cursor}"` : null
      }, query: ${quary ? `"${quary}"` : null},sortKey: ${
        sortkey ? `${sortkey}` : null
      }) {
        edges {
            cursor
          node {
            title
             status
             vendor
             productType
             images(first: 1) {
              nodes {
                src
              }
            }
          }
        }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }`;
    } else if (haspage == 0) {
      infoUrl = `{
        products(last:${pageNo},before:${
        cursor ? `"${cursor}"` : null
      }, query: ${quary ? `"${quary}"` : null},sortKey: ${
        sortkey ? `${sortkey}` : null
      }) {
        edges {
            cursor
          node {
            title
             status
             vendor
             productType
             images(first: 1) {
              nodes {
                src
              }
            }
          }
        }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }`;
    }
    console.log("infourl", infoUrl);
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const client = new Shopify.Clients.Graphql(
      test_session.shop,
      test_session.accessToken
    );
    // console.log("------", infoUrl);
    const data = await client.query({
      data: infoUrl,
    });

    res.status(200).send(data.body.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/graphql", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const client = new Shopify.Clients.Graphql(
      test_session.shop,
      test_session.accessToken
    );

    const data = await client.query({
      data: `mutation {
        productUpdate(input:{id:"${req.body.id}",
         title: "${req.body.title}",
          vendor:"${req.body.vendor}",
          productType:"${req.body.productType}",  
          status:${req.body.status}              
      }) 
      {
          product {
            id
          }
        }
      }`,
    });

    console.log("data", data.data);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/graphql/create", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const client = new Shopify.Clients.Graphql(
      test_session.shop,
      test_session.accessToken
    );

    const data = await client.query({
      data: `mutation {
        productCreate(input:{
         title: "${req.body.title}",
          vendor:"${req.body.vendor}",
          productType:"${req.body.productType}",  
          status:${req.body.status}              
      }) 
      {
          product {
            id
          }
        }
      }`,
    });

    console.log("data", data.data);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/graphql/delete", verifyRequest(app), async (req, res) => {
  try {
    const test_session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      false
    );
    const client = new Shopify.Clients.Graphql(
      test_session.shop,
      test_session.accessToken
    );

    const data = await client.query({
      data: `mutation {
        productDelete(input: {id:"${req.body.id}"})
        {
          deletedProductId
        }
      }`,
    });

    console.log("data", data);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default app;

//graphql query
// query  {
//   products(first: 10,after:null,sortKey:TITLE) {
//     edges {
//       cursor
//     node {
//       title
//        status
//        vendor
//        productType
//        images(first: 1) {
//         nodes {
//           src
//         }
//       }
//     }
//    }
//     pageInfo {
//       hasNextPage
//       hasPreviousPage
//       endCursor
//       startCursor

//     }
//   }
// }
