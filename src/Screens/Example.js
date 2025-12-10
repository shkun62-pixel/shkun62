// import React,{useState,useEffect} from 'react'
// import { Button } from 'react-bootstrap';
// import AccountWiseSummPur from './IncomeTaxReports/AccountWiseSummPur';

// const Example = () => {
//   const [openPurRep, setopenPurRep] = useState(false);

//     useEffect(() => {
//     // Auto open the modal when component mounts
//     setopenPurRep(true);
//   }, []);

//   return (
//     <div>
//       {/* <Button onClick={() => setopenPurRep(true)}>Open Pur Report</Button> */}
//       <AccountWiseSummPur 
//         show={openPurRep} 
//         onClose={() => setopenPurRep(false)} 
//       />
//     </div>
//   )
// }

// export default Example


// import React, { useState, useEffect } from 'react';
// import InputMask from "react-input-mask";
// import financialYear from './Shared/financialYear';

// const Example = () => {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(formatDate(fy.start)); // converted
//     setToDate(formatDate(fy.end));     // converted
//   }, []);

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//         <label className="form-label" style={{ width: "120px" }}>From Date</label>
//         <InputMask
//           mask="99-99-9999"
//           placeholder="dd-mm-yyyy"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//         >
//           {(inputProps) => <input {...inputProps} className="form-control" />}
//         </InputMask>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//         <label className="form-label" style={{ width: "120px"}}>To Date</label>
//         <InputMask
//           mask="99-99-9999"
//           placeholder="dd-mm-yyyy"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//         >
//           {(inputProps) => <input {...inputProps} className="form-control" />}
//         </InputMask>
//       </div>
//     </div>
//   );
// };

// export default Example;


import React,{useState, useEffect} from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Example = ({ ledgerId2, onClose }) => {

  const location = useLocation();
  const ledgerId = location.state?.ledgerId;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Bsgroup: "",
    Bscode:"",
    acode: "",
    gstNo: "",
    ahead: "",
    add1: "",
    city: "",
    state: "",
    distance:"",
    pinCode: "",
    distt: "",
    opening_dr: "",
    opening_cr: "",
    msmed: "",
    phone: "",
    email: "",
    area: "",
    agent: "",
    group: "",
    pan: "",
    tcs206: "",
    tds194q:"",
    tdsno: "",
    wahead: "",
    wadd1: "",
    wadd2: "",
    Rc: "",
    Ecc: "",
    erange: "",
    collc: "",
    srvno: "",
    cperson: "",
    irate: "",
    tds_rate: "",
    tcs_rate: "",
    sur_rate: "",
    weight: "",
    bank_ac: "",
    narration: "",
    subname: "",
    subaddress: "",
    subcity: "",
    subgstNo: "",
    payLimit:0,
    payDuedays:0,
    graceDays:0,
    sortingindex:"",
    qtyBsheet:"",
    discount:0,
    Terms:"",
    tradingAc:"",
    prefixPurInvoice:"",
    status:"",
    ward:"",
    areacode:"",
    aoType:"",
    rangecode:"",
    aoNo:"",
  });
  // Api Response
  const [data1, setData1] = useState([]);
  const [index, setIndex] = useState(0);
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");

  const fetchData = async () => {
      try {
        console.log("ledger_Id:",ledgerId);
        
          let response;
          if (ledgerId) {
            response = await axios.get(
              `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount1/${ledgerId}`
            );
          } else {
            response = await axios.get(
              `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/last`
            );
          }
          // const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/last`);
          if (response.status === 200 && response.data.data || response.data) {
            const lastEntry = response.data.data || response.data || null;
              // Set flags and update form data
              setFirstTimeCheckData("DataAvailable");
              setFormData(lastEntry.formData);
              // Set data and index
              setData1(lastEntry); // Assuming setData1 holds the current entry data
              setIndex(lastEntry.Acodes); // Set index to the voucher number or another identifier
          } else {
              setFirstTimeCheckData("DataNotAvailable");
              console.log("No data available");
              // Create an empty data object with voucher number 0
              const emptyFormData = {
                  Bsgroup: "",
                      Bscode:"",
                  acode: "",
                  gstNo: "",
                  ahead: "",
                  add1: "",
                  city: "",
                  state: "",
                  distance:"",
                  pinCode: "",
                  distt: "",
                  opening_dr: "",
                  opening_cr: "",
                  msmed: "",
                  phone: "",
                  email: "",
                  area: "",
                  agent: "",
                  group: "",
                  pan: "",
                  tcs206: "",
                  tds194q: "",
                  tdsno: "",
                  wahead: "",
                  wadd1: "",
                  wadd2: "",
                  Rc: "",
                  Ecc: "",
                  erange: "",
                  collc: "",
                  srvno: "",
                  cperson: "",
                  irate: "",
                  tds_rate: "",
                  tcs_rate: "",
                  sur_rate: "",
                  weight: "",
                  bank_ac: "",
                  narration: "",
                  subname: "",
                  subaddress: "",
                  subcity: "",
                  subgstNo: "",
                  payLimit:0,
                  payDuedays:0,
                  graceDays:0,
                  sortingindex:"",
                  qtyBsheet:"",
                  discount:0,
                  Terms:"",
                  tradingAc:"",
                  prefixPurInvoice:"",
                  status:"",
                  ward:"",
                  areacode:"",
                  aoType:"",
                  rangecode:"",
                  aoNo:"",
              };
              // Set the empty data
              setFormData(emptyFormData);
              setData1({ formData: emptyFormData}); // Store empty data
              setIndex(0); // Set index to 0 for the empty voucher
          }
      } catch (error) {
          console.error("Error fetching data", error);
          // In case of error, you can also initialize empty data if needed
          const emptyFormData = {
              Bsgroup: "",
                  Bscode:"",
              acode: "",
              gstNo: "",
              ahead: "",
              add1: "",
              city: "",
              state: "",
              distance: "",
              pinCode: "",
              distt: "",
              opening_dr: "",
              opening_cr: "",
              msmed: "",
              phone: "",
              email: "",
              area: "",
              agent: "",
              group: "",
              pan: "",
              tcs206: "",
              tds194q: "",
              tdsno: "",
              wahead: "",
              wadd1: "",
              wadd2: "",
              Rc: "",
              Ecc: "",
              erange: "",
              collc: "",
              srvno: "",
              cperson: "",
              irate: "",
              tds_rate: "",
              tcs_rate: "",
              sur_rate: "",
              weight: "",
              bank_ac: "",
              narration: "",
              subname: "",
              subaddress: "",
              subcity: "",
              subgstNo: "",
              payLimit:0,
              payDuedays:0,
              graceDays:0,
              sortingindex:"",
              qtyBsheet:"",
              discount:0,
              Terms:"",
              tradingAc:"",
              prefixPurInvoice:"",
              status:"",
              ward:"",
              areacode:"",
              aoType:"",
              rangecode:"",
              aoNo:"",
          };
              // Set the empty data
          setFormData(emptyFormData);
          setData1({ formData: emptyFormData}); // Store empty data
          setIndex(0);
      }finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div style={{marginLeft:"50%"}}>
      <h1>AHEAD: {formData.ahead}</h1>
      <h1>BSGROUP: {formData.Bsgroup}</h1>
      <h1>ADD: {formData.add1}</h1>
      <h1>GST NO: {formData.gstNo}</h1>
      <h1>CITY: {formData.city}</h1>
    </div>
  )
}

export default Example
