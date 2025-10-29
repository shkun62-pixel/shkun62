import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import "./outstanding.css";
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
//   width: "50%",
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

const OutStandingOptions = ({ isOpen, onClose, onApply, exportMonthWise }) => {
  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    // console.error("No tenant selected!");
  }
  const [anexureData, setAnexureData] = useState([]);
  const [formData, setFormData] = useState({
    Balance: "Debit Balance",
    OrderBy: "",
    Annexure: "All",
    method:"",
    filter:"",
    Msme:"",
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

   const handleMethod = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      method: value, // Update the ratecalculate field in FormData
    }));
  };

    const handleFilter = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
    ...prevState,
    filter: value, // Update the ratecalculate field in FormData
    }));
    };

    const handleMsMe = (event) => {
        const { value } = event.target; // Get the selected value from the event
        setFormData((prevState) => ({
        ...prevState,
        Msme: value, // Update the ratecalculate field in FormData
        }));
    };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      tabIndex={0} // Ensure modal is focusable for keyboard events
    >
      <StyledModal>
        <Header>OUTSTANDING OPTIONS</Header>
        <div style={{ display: "flex", flexDirection: "row", marginTop: 25 }}>
          <div style={{display:"flex",flexDirection:"column"}}>
          <Card style={{ display: "flex", flexDirection: "column", padding: 10, marginLeft: 10, }}>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10,alignItems:"center" }}
            >
              <text>Method</text>
              <select
                className="method"
                id="method"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.method}
                onChange={handleMethod}
              >
                <option value=""></option>
                <option value="Balances Active">Balances Active</option>
                <option value="Bill Wise Details">Bill Wise Details</option>
                <option value="Days Block Details">Days Block Details</option>
                <option value="Payment Details">Payment Details</option>
                <option value="Bill Selection Wise">Bill Selection Wise</option>
                <option value="Days Block Gross">Days Block Gross</option>
                <option value="Balances All">Balances All</option>
              </select>
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10,alignItems:"center" }}
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
              style={{ display: "flex", flexDirection: "row", marginTop: 10,alignItems:"center" }}
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

            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10,alignItems:"center" }}
            >
              <text>Filter</text>
              <select
                className="Filters"
                id="filter"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.filter}
                onChange={handleFilter}
              >
                <option value=""></option>
                <option value="Local Parites">Local Parites</option>
                <option value="Out of State">Out of State</option>
                <option value="All Parties">All Parties</option>
                <option value="Out of India">Out of India</option>
                <option value="Out of Station">Out of Station</option>
              </select>
            </div>

               <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10,alignItems:"center" }}
            >
              <text>Msme</text>
              <select
                className="Msme"
                id="Msme"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.Msme}
                onChange={handleMsMe}
              >
                <option value=""></option>
                <option value="Micro/Small">Micro/Small</option>
                <option value="Mediun/Large">Mediun/Large</option>
                <option value="Not Covered in MSMED">Not Covered in MSMED</option>
              </select>
            </div>

          </Card>
      
          <div style={{ display: "flex", flexDirection: "row", marginTop:"10px",marginLeft:30 }}>
            <Button
            className="Buttonz"
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
            className="Buttonz"
              style={{ backgroundColor: "#6c5ce7", color: "white", marginLeft: 10 }}
              onClick={() => {
                if (onApply) {
                  onApply(formData);  // just send formData
                }
                onClose();
              }}
            >
              OK
            </Button>

            {/* <Button
            className="Buttonz"
            style={{ backgroundColor: "#6c5ce7", color: "white", marginLeft: 10 }}
            onClick={() => {
              if (formData.T4){
                exportMonthWise();
              }
              if (onApply) onApply(formData);
              onClose();
            }}
          >
            OK
          </Button> */}
          </div>
          </div>
        </div>
      </StyledModal>
    </Modal>
  );
};

export default OutStandingOptions;
