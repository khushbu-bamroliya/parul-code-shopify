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
import "./customer.css";

const Customer = () => {
  const [customer, setCustomer] = useState([]);
  const [activeMsg, setActiveMsg] = useState(false);
  const [active, setActive] = useState(false);
  const [activeCreate, setActiveCreate] = useState(false);

  const [msg, setMsg] = useState("");
  const [input, setInput] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: 0,
    address1: "",
    city: "",
    country: "",
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

  const getCustomers = async () => {
    const token = await getSessionToken(app);
    const res = await axios.get("/api/v2/customers", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    setCustomer(res.data);
  };

  const deleteCustomers = async (id) => {
    const token = await getSessionToken(app);
    const res = await axios.delete(`/api/customers/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };

  const updateCustomers = async () => {
    console.log("input", input);
    const token = await getSessionToken(app);
    const res = await axios.put(
      `/api/v2/customers/${input.id}`,
      {
        id: input.id.toString(),
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: parseInt(input.phone),
        address1: input.address1,
        city: input.city,
        country: input.country,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("update data", res);
  };

  const createCustomer = async () => {
    const token = await getSessionToken(app);
    const res = await axios.post(
      "/api/v2/customers",
      {
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: parseInt(input.phone),
        address1: input.address1,
        city: input.city,
        country: input.country,
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
    getCustomers();
  }, [activeMsg, active, activeCreate]);

  const updatepopmodel = () => {
    return (
      <div>
        <Modal
          open={active}
          onClose={handleChange}
          title="Edit Customer Details"
          primaryAction={{
            content: "Update",
            onAction: () => {
              updateCustomers();
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
                  label="First Name"
                  onChange={(e) => {
                    inputEvent(e, "first_name");
                  }}
                  value={input.first_name}
                />
                <TextField
                  label="Last Name"
                  onChange={(e) => {
                    inputEvent(e, "last_name");
                  }}
                  value={input.last_name}
                />
                <TextField
                  label="Email"
                  onChange={(e) => {
                    inputEvent(e, "email");
                  }}
                  value={input.email}
                />
                <TextField
                  label="Phone"
                  onChange={(e) => {
                    inputEvent(e, "phone");
                  }}
                  value={input.phone}
                />
                <TextField
                  label="Address"
                  onChange={(e) => {
                    inputEvent(e, "address1");
                  }}
                  value={input.address1}
                />
                <TextField
                  label="City"
                  onChange={(e) => {
                    inputEvent(e, "city");
                  }}
                  value={input.city}
                />
                <TextField
                  label="Country"
                  onChange={(e) => {
                    inputEvent(e, "country");
                  }}
                  value={input.country}
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
          title="create Customer "
          primaryAction={{
            content: "Create",
            onAction: () => {
              createCustomer();
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
                label="First Name"
                onChange={(e) => {
                  inputEvent(e, "first_name");
                }}
                value={input.first_name}
              />
              <TextField
                label="Last Name"
                onChange={(e) => {
                  inputEvent(e, "last_name");
                }}
                value={input.last_name}
              />
              <TextField
                label="Email"
                onChange={(e) => {
                  inputEvent(e, "email");
                }}
                value={input.email}
              />
              <TextField
                label="Phone"
                onChange={(e) => {
                  inputEvent(e, "phone");
                }}
                value={input.phone}
              />
              <TextField
                label="Address"
                onChange={(e) => {
                  inputEvent(e, "address1");
                }}
                value={input.address1}
              />
              <TextField
                label="City"
                onChange={(e) => {
                  inputEvent(e, "city");
                }}
                value={input.city}
              />
              <TextField
                label="Country"
                onChange={(e) => {
                  inputEvent(e, "country");
                }}
                value={input.country}
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
        resourceName={{ singular: "customer", plural: "customers" }}
        items={customer}
        renderItem={(item) => {
          const { id, email, first_name, last_name, phone, addresses } = item;
          return (
            <ResourceItem id={id}>
              <div className="tbl">
                <div>
                  <TextStyle variation="strong">{email}</TextStyle>
                </div>
                <div>
                  <TextStyle variation="strong">
                    {first_name}
                    {last_name}
                  </TextStyle>
                </div>
                <div>
                  <TextStyle variation="strong">{phone}</TextStyle>
                </div>
                <div>
                  <TextStyle variation="strong">
                    {addresses[0].address1}
                  </TextStyle>
                </div>

                <div>
                  <TextStyle variation="strong">
                    {addresses[0].city},{addresses[0].country}
                  </TextStyle>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setMsg("Deleted data....");
                      setActiveMsg(true);
                      //   deleteCustomers(id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setActive(true);
                      setInput({
                        id: id,
                        email: email,
                        first_name: first_name,
                        last_name: last_name,
                        phone: phone,
                        address1: addresses[0].address1,
                        city: addresses[0].city,
                        country: addresses[0].country,
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

export default Customer;
