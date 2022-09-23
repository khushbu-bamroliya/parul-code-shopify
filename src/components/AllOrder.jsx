import { Toast, useAppBridge, ResourcePicker } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import {
  Button,
  Modal,
  FormLayout,
  ResourceItem,
  ResourceList,
  TextContainer,
  TextField,
  TextStyle,
} from "@shopify/polaris";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import "./allOrder.css";

let vvid = 0;
const AllOrder = () => {
  const [order, setOrder] = useState([]);
  const [activeMsg, setActiveMsg] = useState(false);
  const [active, setActive] = useState(false);
  const [activeCreate, setActiveCreate] = useState(false);

  const [msg, setMsg] = useState("");
  const [input, setInput] = useState({
    id: "",
    price: 0,
    quantity: 0,
    name: "",
  });

  const app = useAppBridge();

  const toggleActive = useCallback(
    () => setActiveMsg((activeMsg) => !activeMsg),
    []
  );
  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleChangeCreate = useCallback(
    () => setActiveCreate(!activeCreate),
    [activeCreate]
  );
  const inputEvent = (e, key) => {
    setInput({ ...input, [key]: e });
  };

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

  const getOrders = async () => {
    const token = await getSessionToken(app);
    const res = await axios.get("/api/orders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setOrder(res.data);
  };

  const deleteOrders = async (id) => {
    const token = await getSessionToken(app);
    const res = await axios.delete(`/api/orders/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };

  const updateOrders = async () => {
    console.log("input", input);

    const token = await getSessionToken(app);
    const res = await axios.put(
      `/api/orders/${input.id}`,
      {
        name: input.name,
        price: parseInt(input.price),
        quantity: parseInt(input.quantity),
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log("update data", res);
  };

  const createOrder = async () => {
    const token = await getSessionToken(app);
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
  };

  useEffect(() => {
    getOrders();
  }, [activeMsg, active, activeCreate]);

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
              updateOrders();
              handleChange();
              setActiveMsg(true);
              setMsg("update data");
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
                    inputEvent(e, "name");
                  }}
                  value={input.name}
                />
                <TextField
                  label="Quantity"
                  onChange={(e) => {
                    inputEvent(e, "quantity");
                  }}
                  autoComplete="off"
                  value={input.quantity.toString()}
                />
                <TextField
                  label="Price"
                  onChange={(e) => {
                    inputEvent(e, "price");
                  }}
                  autoComplete="off"
                  value={input.price}
                />
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
          title="create Order "
          primaryAction={{
            content: "Create",
            onAction: () => {
              createOrder();
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
            <ResourcePicker
              resourceType="Product"
              onSelection={(SelectPayload) => {
                vvid = SelectPayload.selection[0].variants[0].id.split("/")[4];
                console.log(
                  "slection id",
                  SelectPayload.selection[0].variants[0].id.split("/")[4]
                );
              }}
              open
            />
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
            </FormLayout>
          </Modal.Section>
        </Modal>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "3%" }}>
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
        resourceName={{ singular: "order", plural: "orders" }}
        items={order}
        renderItem={(item) => {
          const { id, total_price, line_items } = item;
          return (
            <ResourceItem id={id}>
              <div className="tbl">
                <div>
                  <TextStyle variation="strong">{line_items[0].name}</TextStyle>
                </div>

                <div>
                  <TextStyle variation="strong">
                    {line_items[0].quantity}
                  </TextStyle>
                </div>
                <div>
                  <TextStyle variation="strong">
                    {line_items[0].price}
                  </TextStyle>
                </div>
                <div>
                  <TextStyle variation="strong">{total_price}</TextStyle>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setMsg("Deleted data....");
                      setActiveMsg(true);
                      deleteOrders(id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setActive(true);
                      console.log(
                        "line_items[0].quantity",
                        line_items[0].quantity
                      );
                      setInput({
                        id: id,
                        price: line_items[0].price,
                        quantity: line_items[0].quantity,
                        name: line_items[0].name,
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
          );
        }}
      />
    </div>
  );
};

export default AllOrder;
