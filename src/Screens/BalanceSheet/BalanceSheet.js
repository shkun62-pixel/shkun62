import React,{useState}from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import Select from "react-select";
import {toast } from "react-toastify";
import "./BalanceSheet.css";
import { useEditMode } from "../../EditModeContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const StyledModal = styled(Box)({
    position: 'absolute',
    top: '48%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "70%",
    background: 'linear-gradient(to right,rgb(238, 238, 248), #b19cd9)',
    boxShadow: `5px 5px 15px rgb(255, 248, 248),
    -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 10px rgba(0, 0, 0, 0.2),
    inset -5px -5px 10px rgba(255, 255, 255, 0.2)`,
    border: '2px solid black',
    padding: 16,
    borderRadius: 15,
});

const BalanceSheet = ({ isOpen, onClose, onNavigate}) => {
  const [showDiv, setShowDiv] = useState(false);
    const [formData, setFormData] = useState({
        T1:"",
        T2:"",
        T3:"",
        T4:"",
        T5:"",
        From: null,
        Upto: null, 
        GpRatio:"",
     });

     const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, From: date }));
      };
      
      const handleDateChangeUpto = (date) => {
        setFormData((prev) => ({ ...prev, Upto: date }));
      };

     const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
    
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value, // Update based on type
        }));
      };
      
    const handleNumericValue = (event) => {
      const { id, value } = event.target;
      // Allow only numeric values, including optional decimal points
      if (/^\d*\.?\d*$/.test(value) || value === '') {
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
    };

    const handleNavigation = (path) => {
      onNavigate(); // Close the side drawer
     onClose(); // Close the modal
 };
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            tabIndex={0} // Ensure modal is focusable for keyboard events
        >
           <StyledModal>
            <div style={{display:'flex',flexDirection:'row'}}>
                {/* Left Side */}
                <div style={{display:'flex',flexDirection:'row',marginLeft:"2%"}}>
                <div style={{display:'flex',flexDirection:'column'}}>
                <text style={{fontSize:20}}>BALANCE SHEET OPTIONS</text>
                <Button style={{backgroundColor:"#7755B7",color:'white',marginTop:20}}>BALANCE SHEET</Button>
                <Button style={{backgroundColor:"#7755B7",color:'white',marginTop:10}}>STOCK VALUE</Button>
                <Button style={{backgroundColor:"#7755B7",color:'white',marginTop:10}}>ADJUSTMENT</Button>
                <Button   onClick={() => setShowDiv(!showDiv)} style={{backgroundColor:"#7755B7",color:'white',marginTop:10}}>ANNEXURES</Button>
                {showDiv && (
        <div style={{display:'flex',flexDirection:'column',border:'1px solid black'}}>
  <label style={{ display: "flex", alignItems: "center",marginTop:5,marginLeft:10}}>
        <input
          type="checkbox"
          name="T4"
          checked={formData.T4}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Annex.Menu</span>
      </label>
      <label style={{ display: "flex", alignItems: "center",marginLeft:10}}>
        <input
          type="checkbox"
          name="T5"
          checked={formData.T5}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Annex.Print</span>
      </label>
        </div>
      )}
      <Button style={{backgroundColor:"#7755B7",color:'white',marginTop:10}}>DEPRECIATION CHART</Button>
      <Button style={{backgroundColor:"#7755B7",color:'white',marginTop:10}}>COST EXPENSES</Button>
      </div>
      <div style={{marginLeft:20,marginTop:"10%"}}>
      <div style={{border:'1px solid black',padding:5,borderRadius:5}}>
      <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T1"
          checked={formData.T1}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Current Balance</span>
      </label>
            <label style={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          name="T2"
          checked={formData.T2}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "10px" }}>Opening Balance</span>
      </label>
      </div>
      <div style={{display:'flex',flexDirection:'row',marginTop:40}}>
        <text>Period From</text>
        <DatePicker
        selected={formData.From}
        onChange={handleDateChange}
        onChangeRaw={(e) => {
          let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
          if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
          if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

          e.target.value = val; // Show formatted input
        }}
        dateFormat="dd/MM/yyyy"  // Format for display
        className="custom-datepickerFrom"
        style={{ border: "1px solid black", marginLeft: 5, height: 30 }}
      />
      </div>
      <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
        <text>Upto</text>
        <DatePicker
        selected={formData.Upto}
        onChange={handleDateChangeUpto}
        onChangeRaw={(e) => {
          let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
          if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
          if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

          e.target.value = val; // Show formatted input
        }}
        dateFormat="dd/MM/yyyy"  // Format for display
        className="custom-datepickerUpto"
        style={{ border: "1px solid black", marginLeft: 5, height: 30 }}
      />
      </div>
      <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
        <text>GP.Ratio</text>
        <input
        id='GpRatio'
        className='GpRatio'
        value={formData.GpRatio}
        onChange={handleNumericValue}
        />
      </div>
      <div style={{display:'flex',flexDirection:'row',marginLeft:-250,marginTop:"50%"}}>
      <Button style={{backgroundColor:"#7755B7",color:'white',width:120}}>Options</Button>
      <Button onClick={handleNavigation} style={{backgroundColor:"#7755B7",color:'white',width:120,marginLeft:10}}>Exit</Button>
      <Button style={{backgroundColor:"#7755B7",color:'white',width:120,marginLeft:10}}>Export</Button>
      <Button style={{backgroundColor:"#7755B7",color:'white',width:120,marginLeft:10}}>OK</Button>
      </div>
      <div style={{display:'flex',flexDirection:'row',marginTop:10,marginLeft:2}}>
   
      </div>
      </div>
                </div>
              {/* Right Side */}
            <div style={{display:'flex',flexDirection:'column',marginLeft:40}}>
            <div style={{display:'flex',flexDirection:'row',marginLeft:"30%"}}>
            <text>Attentions</text>
            <label style={{ display: "flex", alignItems: "center",marginLeft:20}}>
        <input
          type="checkbox"
          name="T3"
          checked={formData.T3}
          onChange={handleChange}
          className="custom-checkbox"
        />
        <span style={{ marginLeft: "2px" }}>Save Changes</span>
        </label>
            </div>
            <div style={{display:'flex',flexDirection:'column',border:'1px solid black',padding:5,borderRadius:5}}>
              <text>1. Depreciation</text>
              <text>2. Provisioning of Power Expenses</text>
              <text>3. Bonus & LWW Expenses</text>
              <text>4. Prepaid Exp.(Relating To Insurance or Amc Is Debited In Books)</text>
              <text>5. Interest On Loans And Tds Thereon</text>
              <text>6. Interest On Cc Limit </text>
              <text>7. Discounts For Both Debtors And Creditors</text>
              <text>8. Positive Cash Balance On Each Day Of Fy</text>
              <text>9. Expenses Payable Related To Salary, Wages, Pf, Esi & Power Exp.</text>
              <text>10. Audit Fee</text>
              <text>11. Deffered Tax (in Case Of Company)</text>
              <text>12. Valuation Of Closing Stock</text>
              <text>13. Gst Output Tax And Input Tax Reconciliation With The Portal</text>
              <text>14. Tds/tcs Recoverable Reconciliation With Form 26as</text>
              <text>15. Entry For Cheques In Hand And Cheques Issued But Not Presented</text>
            </div>
           </div>
      </div>
      </StyledModal>
      </Modal>
    );
};

export default BalanceSheet;
