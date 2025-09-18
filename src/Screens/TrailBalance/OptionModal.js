import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import "./OptionModal.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import { Card } from "@mui/material";

const StyledModal = styled(Box)({
  position: "absolute",
  top: "48%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  // height: "72%",
  boxShadow: `0px 8px 24px rgba(0,0,0,0.2)`,
  background: "white",
  padding: 16,
  borderRadius: 15,
});

const Header = styled("div")({
  background: "linear-gradient(90deg, #6c5ce7, #a29bfe)",
  color: "white",
  padding: "15px 20px",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center",
  borderRadius: 15,
});

const OptionModal = ({ isOpen, onClose, onApply }) => {
  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    // console.error("No tenant selected!");
  }
  const [anexureData, setAnexureData] = useState([]);
  const [formData, setFormData] = useState({
    Balance: "Active Balance",
    OrderBy: "",
    Annexure: "All",
    T1: false,
    T2: false,
    T3: false,
    T4: false,
    T5: false,
    T6: false,
    T7: true,
    T8: false,
    T9: true,
    T10: false,
    T11: false,
  });

  useEffect(() => {
    // Fetch data from API
    axios
      .get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/anexure`
      )
      .then((response) => {
        // Extract only formData.name from the response
        const names = response.data.map((item) => item.formData.name);
        setAnexureData(names);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle selection change
  const handleSelectChange = (event) => {
    setFormData({ ...formData, Annexure: event.target.value });
  };

  const handleBalance = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Balance: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleOrder = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      OrderBy: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Update based on type
    }));
  };


  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      tabIndex={0} // Ensure modal is focusable for keyboard events
    >
      <StyledModal>
        <Header>TRAIL VIEW OPTIONS</Header>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 25 }}>
            {/* LEFT SIDE */}
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 10,
              marginLeft: 20,
            }}
          >
            {/* Mutually exclusive using radio buttons */}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  className="custom-radio"
                  type="radio"
                  name="balanceOption"   // same group
                  value="T7"
                  checked={formData.T7}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, T7: true, T8: false }))
                  }
                />
                <span style={{ marginLeft: "10px" }}>Current Balance</span>
              </label>

              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                className="custom-radio"
                  type="radio"
                  name="balanceOption"   // same group
                  value="T8"
                  checked={formData.T8}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, T7: false, T8: true }))
                  }
                />
                <span style={{ marginLeft: "10px" }}>Opening Summary</span>
              </label>
            </div>

            {/* Mutually exclusive using radio buttons for Detailed & Annx.Summary */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                className="custom-radio"
                  type="radio"
                  name="detailOption"   // new group
                  value="T9"
                  checked={formData.T9}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, T9: true, T10: false }))
                  }
                />
                <span style={{ marginLeft: "10px" }}>Detailed</span>
              </label>

              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                className="custom-radio"
                  type="radio"
                  name="detailOption"   // same group
                  value="T10"
                  checked={formData.T10}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, T9: false, T10: true }))
                  }
                />
                <span style={{ marginLeft: "10px" }}>Annx.Summary</span>
              </label>
            </div>

            <hr style={{marginTop:5}}/>
            
            <div style={{ marginTop: 10 }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T1"
                  checked={formData.T1}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>Selected Accounts</span>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T2"
                  checked={formData.T2}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>Print Quantity</span>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T3"
                  checked={formData.T3}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>Print Current Date</span>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T4"
                  checked={formData.T4}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>Month Wise Total</span>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T5"
                  checked={formData.T5}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>
                  {" "}
                  With Debit & Debit Total (Export)
                </span>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T6"
                  checked={formData.T6}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>
                  Cash Flow Trail Balance
                </span>
              </label>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="T11"
                  checked={formData.T11}
                  onChange={handleChange}
                  className="custom-checkbox"
                />
                <span style={{ marginLeft: "10px" }}>Print Balance</span>
              </label>
            </div>
          </Card>

          {/* RIGHT SIDE */}
          <div style={{display:"flex",flexDirection:"column"}}>
          <Card style={{ display: "flex", flexDirection: "column", padding: 10, marginLeft: 40, }}>
            <div style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
              <text>Balance</text>
              <select
                className="Balance"
                id="Balance"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.Balance}
                onChange={handleBalance}
              >
                <option value="Active Balance">Active Balance</option>
                <option value="Nil Balance">Nil Balance</option>
                <option value="Debit Balance">Debit Balance</option>
                <option value="Credit Balance">Credit Balance</option>
                <option value="Transacted Account">Transacted Account</option>
                <option value="Non Transacted Account">
                  Non Transacted Account
                </option>
                <option value="All Accounts">All Accounts</option>
              </select>
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <text>Order By</text>
              <select
                className="OrderBY"
                id="OrderBy"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.OrderBy}
                onChange={handleOrder}
              >
                <option value=""></option>
                <option value="Annexure Wise">Annexure Wise</option>
                <option value="Account Name Wise">Account Name Wise</option>
                <option value="City Wise + Name Wise">
                  City Wise + Name Wise
                </option>
                <option value="Sorting Order No.Wise">
                  Sorting Order No.Wise
                </option>
                <option value="Transacted Account">Prefix Annexure Wise</option>
              </select>
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <text>Annexure</text>
              <select
                className="Annexure"
                value={formData.Annexure}
                onChange={handleSelectChange}
              >
                <option value="All">All</option>
                {anexureData.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </Card>
      
          <div style={{ display: "flex", flexDirection: "row", marginTop:"auto",justifyContent:"center" }}>
            <Button style={{ backgroundColor: "#6c5ce7", color: "white" }}>
              Chk_Errors
            </Button>
            <Button
              style={{
                backgroundColor: "#6c5ce7",
                color: "white",
                marginLeft: 10,
              }}
              onClick={onClose}
            >
              EXIT
            </Button>
            <Button
            style={{ backgroundColor: "#6c5ce7", color: "white", marginLeft: 10 }}
            onClick={() => {
              if (onApply) onApply(formData);
              onClose();
            }}
          >
            OK
          </Button>
          </div>
          </div>
        </div>
      </StyledModal>
    </Modal>
  );
};

export default OptionModal;
