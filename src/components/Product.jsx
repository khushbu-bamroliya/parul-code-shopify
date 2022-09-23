import {
  Avatar,
  Button,
  Card,
  FormLayout,
  Link,
  Modal,
  RadioButton,
  ResourceItem,
  ResourceList,
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

const Product = () => {
  const [product, setProduct] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [active, setActive] = useState(false);
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

  const handleChange = useCallback(() => setActive(!active), [active]);
  const [value, setValue] = useState("active");
  const [input, setinput] = useState({
    id: "",
    title: "",
    vendor: "",
    status: true,
    product_type: "",
    variants_id: "",
  });

  const inputEvent = (e, key) => {
    setinput({ ...input, [key]: e });
  };

  console.log("radio value", value);

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  async function getProduct() {
    // const token = await getSessionToken(app);
    const data = await fetch("/products").then((res) => res.json());
    setProduct(data);
    console.log("data", data);
  }

  // async function getsingleProduct(id) {
  //   console.log("single order id", id);
  //   setActive(true);
  //   const data = await fetch(`/products/${id}`).then((res) => res.json());
  //   setinput(data);
  //   console.log("single data input", data);
  // }
  async function deleteProduct(id) {
    console.log(" delete id", id);
    const data = await fetch(`/products/${id}`, {
      method: "DELETE",
    });
    console.log("delete record", data);
  }

  async function updateProduct() {
    console.log("update input", input);
    const data = await fetch(`/products/${input.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    console.log("update record", data);
  }

  const createProduct = async () => {
    const token = await getSessionToken(app);
    const res = await axios.post(
      "/products",
      {
        title: input.title,
        vendor: input.vendor,
        product_type: input.product_type,
        status: input.status,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("res", res);
  };

  useEffect(() => {
    getProduct();
  }, [active, activeMsg]);

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
                    inputEvent(e, "product_type");
                  }}
                  autoComplete="off"
                  name="product_type"
                  value={input.product_type}
                />
                <Stack>
                  <RadioButton
                    label="Active"
                    checked={input.status === "active"}
                    id="active"
                    name="accounts"
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "active" : "" });
                    }}
                  />
                  <RadioButton
                    label="archived"
                    id="archived"
                    name="accounts"
                    checked={input.status === "archived"}
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "archived" : "" });
                    }}
                  />
                  <RadioButton
                    label="draft"
                    id="draft"
                    name="accounts"
                    checked={input.status === "draft"}
                    onChange={(value) => {
                      setinput({ ...input, status: value ? "draft" : "" });
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
                  inputEvent(e, "product_type");
                }}
                autoComplete="off"
                name="product_type"
                value={input.product_type}
              />
              <Stack>
                <RadioButton
                  label="Active"
                  checked={input.status === "active"}
                  id="active"
                  name="accounts"
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "active" : "" });
                  }}
                />
                <RadioButton
                  label="archived"
                  id="archived"
                  name="accounts"
                  checked={input.status === "archived"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "archived" : "" });
                  }}
                />
                <RadioButton
                  label="draft"
                  id="draft"
                  name="accounts"
                  checked={input.status === "draft"}
                  onChange={(value) => {
                    setinput({ ...input, status: value ? "draft" : "" });
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
      <div style={{ marginRight: "50px" }}>
      <br/>
        <Button
          onClick={() => {
            setActiveCreate(true);
          }}
        >
          Create
        </Button>
      </div>
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
          const { id, title, status, vendor, product_type, images } = item;
          return (
            <>
              <ResourceItem id={id}>
                <div className="tbl">
                  <div>
                    <Thumbnail
                      source={images && images.length > 0 ? images[0].src : ""}
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
                    <TextStyle variation="strong">{product_type} </TextStyle>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setinput({
                          id: id,
                          title: title,
                          vendor: vendor,
                          status: status,
                          product_type: product_type,
                        });
                        setActiveMsg(true);
                        deleteProduct(id);
                        setMsg("Delete record");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setActive(true);
                        setinput({
                          id: id,
                          title: title,
                          vendor: vendor,
                          status: status,
                          product_type: product_type,
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
    </div>
  );
};

export default Product;
