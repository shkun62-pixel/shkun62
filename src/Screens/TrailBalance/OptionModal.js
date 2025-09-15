import React, { useState, useEffect} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import "./OptionModal.css";
import Button from "@mui/material/Button";
import {toast } from "react-toastify";
import { useEditMode } from "../../EditModeContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";

const StyledModal = styled(Box)({
  position: "absolute",
  top: "48%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "72%",
  background: "linear-gradient(to right,rgb(238, 238, 248), #b19cd9)",
  boxShadow: `5px 5px 15px rgb(255, 248, 248),
    -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 10px rgba(0, 0, 0, 0.2),
    inset -5px -5px 10px rgba(255, 255, 255, 0.2)`,
  border: "2px solid black",
  padding: 16,
  borderRadius: 15,
});

const OptionModal = ({ isOpen, onClose }) => {

  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }
  const [anexureData, setAnexureData] = useState([]);
  const [formData, setFormData] = useState({
    Balance: "",
    OrderBy: "",
    Annexure:"",
    From: null,  // Changed from empty string to null
    Upto: null, 
    T1: false,
    T2: false,
    T3: false,
    T4: false,
    T5: false,
    T6: false,
    T7: false,
    T8: false,
    T9: false,
    T10: false,
  });

  useEffect(() => {
    // Fetch data from API
    axios
      .get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/anexure`)
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
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, From: date }));
  };
  
  const handleDateChangeUpto = (date) => {
    setFormData((prev) => ({ ...prev, Upto: date }));
  };
  

  useEffect(() => {
    const formattedFrom = formData.From ? format(formData.From, "dd/MM/yyyy") : "Not Selected";
    const formattedUpto = formData.Upto ? format(formData.Upto, "dd/MM/yyyy") : "Not Selected";
  
    console.log("Updated Form Data:", {
      ...formData,
      From: formattedFrom,
      Upto: formattedUpto,
    });
  }, [formData]);
  
  
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      tabIndex={0} // Ensure modal is focusable for keyboard events
    >
      <StyledModal>
        <text style={{ fontSize: 25, marginLeft: "35%" }}>
          Trail View Options
        </text>
        <div style={{ display: "flex", flexDirection: "row" ,marginTop:25}}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
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
                <option value=""></option>
                <option value="Active Balance">Active Balance</option>
                <option value="Nil Balance">Nil Balance</option>
                <option value="Debit Balance">Debit Balance</option>
                <option value="Credit Balance">Credit Balance</option>
                <option value="Transacted Account">Transacted Account</option>
                <option value="Non Transacted Account">
                  Transacted Account
                </option>
                <option value="All Accounts">All Accounts</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row",marginTop:10}}>
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
                <option value="City Wise + Name Wise">City Wise + Name Wise</option>
                <option value="Sorting Order No.Wise">Sorting Order No.Wise</option>
                <option value="Transacted Account">Prefix Annexure Wise</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row",marginTop:10 }}>
              <text>Annexure</text>
             <select className="Annexure" value={formData.Annexure} onChange={handleSelectChange}>
        <option value=""></option>
        {anexureData.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
    <div style={{marginTop:20,marginLeft:'20%'}}>
      <label style={{ display: "flex", alignItems: "center"}}>
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
        <span style={{ marginLeft: "10px" }}>Print Quality</span>
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
        <span style={{ marginLeft: "10px" }}> With Debit & Debit Total (Export)</span>
      </label>
      <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T6"
          checked={formData.T6}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Cash Flow Trail Balance</span>
      </label>
      </div>
      <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
        <text>Period From</text>
        <DatePicker
        selected={formData.From}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"  // Format for display
        className="custom-datepickerF"
        style={{ border: "1px solid black", marginLeft: 5, height: 30 }}
      />
      </div>
      <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
        <text>Upto</text>
        <DatePicker
        selected={formData.Upto}
        onChange={handleDateChangeUpto}
        dateFormat="dd/MM/yyyy"  // Format for display
        className="custom-datepickerU"
        style={{ border: "1px solid black", marginLeft: 5, height: 30 }}
      />
        <div style={{display:'flex',flexDirection:'row',marginLeft:90}}>
        <Button style={{backgroundColor:'#7755B7',color:'white'}}>Chk_Errors</Button>
        <Button style={{backgroundColor:'#7755B7',color:'white',marginLeft:10}} onClick={onClose}>EXIT</Button>
        <Button style={{backgroundColor:'#7755B7',color:'white',marginLeft:10}}>OK</Button>
        </div>
      </div>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", flexDirection: "column",marginLeft:-80 }}>
            <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T7"
          checked={formData.T7}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Current Balance</span>
      </label>
            <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T8"
          checked={formData.T8}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Opening Summary</span>
      </label>
            <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T9"
          checked={formData.T9}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Detailed</span>
      </label>
            <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T10"
          checked={formData.T10}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Annx.Summary</span>
      </label>
        </div>
          
        </div>
      </StyledModal>
    </Modal>
  );
};

export default OptionModal;
