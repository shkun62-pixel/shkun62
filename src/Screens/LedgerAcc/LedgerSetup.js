import React, { useState, useEffect } from "react";

const LedgerSetup = () => {
  const initialFormData = {
    Bsgroup: true,
    acode: true,
    gstNo: true,
    ahead: true,
    add1: true,
    city: true,
    state: true,
    distance: true,
    pinCode: true,
    distt: true,
    opening_dr: true,
    opening_cr: true,
    msmed: true,
    phone: true,
    email: true,
    area: true,
    agent: true,
    group: true,
    pan: true,
    tcs206: true,
    tds194q: true,
    tdsno: true,
    wahead: true,
    wadd1: true,
    wadd2: true,
    Rc: true,
    Ecc: true,
    erange: true,
    collc: true,
    srvno: true,
    cperson: true,
    irate: true,
    tds_rate: true,
    tcs_rate: true,
    sur_rate: true,
    weight: true,
    bank_ac: true,
    narration: true,
    subname: true,
    subaddress: true,
    subcity: true,
    subgstNo: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Load formData from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Use saved data if available
    }
  }, []);

  const handleOptionClick = (key) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [key]: !prev[key], // Toggle the boolean value
      };
      localStorage.setItem("formData", JSON.stringify(updatedFormData)); // Update localStorage
      return updatedFormData;
    });
  };

  const handleSave = () => {
    localStorage.setItem("formData", JSON.stringify(formData)); // Save to localStorage
    console.log("FormData saved to localStorage:", formData);
  };

  return (
    <div>
      <h1>LEDGER SETUP</h1>
      <div style={{marginLeft:50}}>
        <select
        style={{width:400,height:400,fontSize:20}}
          multiple
          value={Object.keys(formData).filter((key) => formData[key])} // Pre-select options based on true values
          onChange={(e) => {
            const clickedOption = e.target.value;
            handleOptionClick(clickedOption);
          }}
        >
          {Object.keys(formData).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default LedgerSetup;
