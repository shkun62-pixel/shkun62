import React,{useState,useEffect} from 'react'
import { Button } from 'react-bootstrap';
import AccountWiseSummPur from './IncomeTaxReports/AccountWiseSummPur';

const Example = () => {
  const [openPurRep, setopenPurRep] = useState(false);

    useEffect(() => {
    // Auto open the modal when component mounts
    setopenPurRep(true);
  }, []);

  return (
    <div>
      {/* <Button onClick={() => setopenPurRep(true)}>Open Pur Report</Button> */}
      <AccountWiseSummPur 
        show={openPurRep} 
        onClose={() => setopenPurRep(false)} 
      />
    </div>
  )
}

export default Example


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