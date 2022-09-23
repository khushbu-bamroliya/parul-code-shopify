import {
  Avatar,
  Button,
  Card,
  FormLayout,
  Link,
  Modal,
  Pagination,
  RadioButton,
  ResourceItem,
  ResourceList,
  Select,
  Spinner,
  Stack,
  TextContainer,
  TextField,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import "./product.css";
import { userLoggedInFetch } from "../App";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";

import axios from "axios";

const GraphProduct = () => {
  const [product, setProduct] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  //pagination
  const [pageCursorData, setPageCursorData] = useState([]);
  const [pageCursor, setPageCursor] = useState(null);
  const [hasPage, setHasPage] = useState({
    next: false,
    prev: false,
  });
  //search
  const [keyword, setKeyword] = useState("");
  //loader
  const [loader, SetLoader] = useState(true);
  //sorting
  const [selected, setSelected] = useState("");
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const options = [
    { label: "vendor", value: "VENDOR" },
    { label: "Product type", value: "PRODUCT_TYPE" },
    { label: "Title", value: "TITLE" },
  ];

  //message
  const [activeMsg, setActiveMsg] = useState(false);
  const [msg, setMsg] = useState(false);
  const [activeCreate, setActiveCreate] = useState(false);
  const toggleActive = useCallback(
    () => setActiveMsg((activeMsg) => !activeMsg),
    []
  );
  const handleChangeCreate = useCallback(
    () => setActiveCreate(!activeCreate),
    [activeCreate]
  );
  const toastMarkup = activeMsg ? (
    <Toast
      content={msg}
      action={{
        content: "Undo",
        onAction: () => {},
      }}
      duration={10000}
      onDismiss={toggleActive}
    />
  ) : null;

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);

  const [input, setinput] = useState({
    id: "",
    title: "",
    vendor: "",
    status: true,
    productType: "",
    variants_id: "",
  });
  const inputEvent = (e, key) => {
    setinput({ ...input, [key]: e });
  };

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  // async function getProduct() {
  //   const res = await fetch("/graphql/getdata", {
  //     params: {
  //       cursor: pageCursor,
  //       // haspage: hasPage.next ? 1 : hasPage.prev ? 0 : 1,
  //     },
  //   }).then((res) => res.json());
  //   setProduct(res.products.edges);
  //   setPageCursorData(res.products.pageInfo);
  //   console.log("pageinfo", res.products.pageInfo);
  //   console.log("res", res);

  // }

  async function getProduct(flag) {
    try {
      const token = await getSessionToken(app);
      await axios
        .get("/graphql/getdata", {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: {
            cursor: pageCursor,
            haspage: flag,
            quary: keyword,
            sortkey: selected,
          },
        })
        .then((res) => {
          SetLoader(false);
          setProduct(res.data.products.edges);
          setPageCursorData(res.data.products.pageInfo);
          console.log("pageCursorData", pageCursorData);
          setHasPage({
            prev: res.data.products.pageInfo.hasPreviousPage,
            next: res.data.products.pageInfo.hasNextPage,
          });
          console.log("hasepage", hasPage);
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  async function deleteProduct(id) {
    console.log(" delete id", id);
    const token = await getSessionToken(app);
    const res = await axios.post(
      "/graphql/delete",
      {
        id: input.id,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("delete record", res.status);
    if (res.status == 200) {
      setMsg("deleted successfully");
      setActiveMsg(true);
    }
  }

  async function updateProduct() {
    console.log("update input", input);
    const datainfo = {
      id: input.id,
      title: input.title,
      vendor: input.vendor,
      productType: input.productType,
      status: input.status,
    };
    const data = await fetch(`/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datainfo),
    });
    console.log("update record", datainfo);
  }

  const createProduct = async () => {
    const token = await getSessionToken(app);
    const res = await axios.post(
      "/graphql/create",
      {
        title: input.title,
        vendor: input.vendor,
        productType: input.productType,
        status: input.status,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("create res", res);
  };

  useEffect(() => {
    getProduct(1);
  }, [pageCursor, keyword, selected]);

  const updatepopmodel = () => {
    return (
      <div>
        <Modal
          open={active}
          onClose={handleChange}
          title="Edit Product Details"
          primaryAction={{
            content: "Update",
            onAction: () => {
              updateProduct();
              handleChange();
              setActiveMsg(true);
              setMsg("Update record");
            },
          }}
          secondaryActions={[
            {
              content: "close",
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <FormLayout>
                <TextField
                  label="Name"
                  onChange={(e) => {
                    inputEvent(e, "title");
                  }}
                  autoComplete="off"
                  value={input.title}
                />
                <TextField
                  label="Vendor"
                  onChange={(e) => {
                    inputEvent(e, "vendor");
                  }}
                  autoComplete="off"
                  value={input.vendor}
                />
                <TextField
                  label="Product Type"
                  onChange={(e) => {
                    inputEvent(e, "productType");
                  }}
                  autoComplete="off"
                  name="productType"
                  value={input.productType}
                />
                <Stack>
                  <RadioButton
                    label="Active"
                    checked={input.status === "ACTIVE"}
                    id="ACTIVE"
                    name="accounts"
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "ACTIVE" : "" });
                    }}
                  />
                  <RadioButton
                    label="archived"
                    id="ARCHIVED"
                    name="accounts"
                    checked={input.status === "ARCHIVED"}
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "ARCHIVED" : "" });
                    }}
                  />
                  <RadioButton
                    label="draft"
                    id="DRAFT"
                    name="accounts"
                    checked={input.status === "DRAFT"}
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "DRAFT" : "" });
                    }}
                  />
                </Stack>
              </FormLayout>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    );
  };
  const createpopomodel = () => {
    return (
      <div>
        <Modal
          open={activeCreate}
          onClose={handleChangeCreate}
          title="create Product "
          primaryAction={{
            content: "Create",
            onAction: () => {
              createProduct();
              handleChangeCreate();
              setActiveMsg(true);
              setMsg("Create Record");
            },
          }}
          secondaryActions={[
            {
              content: "close",
              onAction: handleChangeCreate,
            },
          ]}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                label="Name"
                onChange={(e) => {
                  inputEvent(e, "title");
                }}
                autoComplete="off"
                value={input.title}
              />
              <TextField
                label="Vendor"
                onChange={(e) => {
                  inputEvent(e, "vendor");
                }}
                autoComplete="off"
                value={input.vendor}
              />
              <TextField
                label="Product Type"
                onChange={(e) => {
                  inputEvent(e, "productType");
                }}
                autoComplete="off"
                name="productType"
                value={input.productType}
              />
              <Stack>
                <RadioButton
                  label="Active"
                  checked={input.status === "ACTIVE"}
                  id="ACTIVE"
                  name="accounts"
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "ACTIVE" : "" });
                  }}
                />
                <RadioButton
                  label="archived"
                  id="ARCHIVED"
                  name="accounts"
                  checked={input.status === "ARCHIVED"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "ARCHIVED" : "" });
                  }}
                />
                <RadioButton
                  label="draft"
                  id="DRAFT"
                  name="accounts"
                  checked={input.status === "DRAFT"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "DRAFT" : "" });
                  }}
                />
              </Stack>
            </FormLayout>
          </Modal.Section>
        </Modal>
      </div>
    );
  };
  return (
    <div className="main">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <FormLayout>
          <TextField
            placeholder="Search a Product ..."
            onChange={(e) => setKeyword(e)}
            autoComplete="off"
            value={keyword}
          />
        </FormLayout>
        <Button onClick={() => getProduct(1)}>Search</Button>

        <Select
          options={options}
          onChange={handleSelectChange}
          value={selected}
          placeholder="Sorting"
        />
        <Button
          onClick={() => {
            setActiveCreate(true);
          }}
        >
          Create
        </Button>
      </div>
      {loader ? (
        <Spinner accessibilityLabel="Spinner example" size="large" />
      ) : (
        <>
          {" "}
          <ResourceList
            resourceName={{ singular: "product", plural: "products" }}
            items={product}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            selectable
            renderItem={(item) => {
              // const variants_id = item.variants.map((e) => {
              //   console.log("e", e);
              //   return e.id;
              // });
              const { id, title, status, vendor, productType, images } =
                item.node;

              return (
                <>
                  <ResourceItem id={id}>
                    <div className="tbl">
                      <div>
                        <Thumbnail
                          source={
                            images && images.length > 0 ? images[0].src : ""
                          }
                          alt="Black choker necklace"
                          size="small"
                        />
                      </div>
                      <div>
                        {" "}
                        <TextStyle variation="strong">{title} </TextStyle>
                      </div>
                      <div>
                        {" "}
                        <TextStyle variation="strong">{status}</TextStyle>
                      </div>
                      <div>
                        {" "}
                        <TextStyle variation="strong">{vendor} </TextStyle>
                      </div>
                      <div>
                        {" "}
                        <TextStyle variation="strong">{productType} </TextStyle>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            setinput({
                              id: id,
                              title: title,
                              vendor: vendor,
                              status: status,
                              productType: productType,
                            });
                            setActiveMsg(true);
                            deleteProduct(id);
                            setMsg("Are Sure delete record");
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            setActive(true);
                            console.log("id", id);
                            setinput({
                              id: id,
                              title: title,
                              vendor: vendor,
                              status: status,
                              productType: productType,
                            });
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    {updatepopmodel()}
                    {createpopomodel()}
                    {toastMarkup}
                  </ResourceItem>
                </>
              );
            }}
          />
        </>
      )}
      {product.length > 2 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            label="Pages"
            hasPrevious={hasPage.prev}
            onPrevious={() => {
              console.log("hasPage.prev", hasPage.prev);
              getProduct(0);
              setPageCursor(pageCursorData.startCursor);
            }}
            hasNext={hasPage.next}
            onNext={() => {
              console.log("hasPage.next", hasPage.next);

              getProduct(1);
              setPageCursor(pageCursorData.endCursor);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default GraphProduct;
