// import React from "react";
// import Modal from "react-bootstrap/Modal";
// import { Table, Button, Form } from "react-bootstrap";
// import InputMask from "react-input-mask";

// const SearchModal = ({
//   show,
//   onClose,
//   bills,
//   filteredBills,
//   searchBillNo,
//   setSearchBillNo,
//   searchDate,
//   setSearchDate,
//   onProceed,
//   onSelectBill,
//   isoToDDMMYYYY,
// }) => {
//   return (
//     <Modal show={show} onHide={onClose} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Search</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         {/* Filters */}
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//           <Form.Control
//             type="text"
//             placeholder="Enter Bill No..."
//             value={searchBillNo}
//             onChange={(e) => setSearchBillNo(e.target.value)}
//           />

//           <InputMask
//             mask="99-99-9999"
//             placeholder="DD-MM-YYYY"
//             value={searchDate}
//             onChange={(e) => setSearchDate(e.target.value)}
//             className="form-control"
//           />

//           <Button variant="primary" onClick={onProceed}>
//             Proceed
//           </Button>

//           <Button
//             variant="secondary"
//             onClick={() => {
//               setSearchBillNo("");
//               setSearchDate("");
//             }}
//           >
//             Clear
//           </Button>
//         </div>

//         {/* Results */}
//         <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Bill No</th>
//                 <th>Date</th>
//                 <th>Account Name</th>
//                 <th>Payment</th>
//                 <th>Receipt</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredBills.length > 0 ? (
//                 filteredBills.map((bill) => (
//                   <tr key={bill._id}>
//                     <td>{bill.formData.voucherno}</td>
//                     <td>{bill.formData.date}</td>
//                     <td>{bill.items?.[0]?.accountname}</td>
//                     <td>{bill.formData.totalpayment}</td>
//                     <td>{bill.formData.totalreceipt}</td>
//                     <td>
//                       <Button
//                         size="sm"
//                         onClick={() => onSelectBill(bill)}
//                       >
//                         Select
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: "center" }}>
//                     No matching records
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default SearchModal;


import React, { useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Table, Button, Form } from "react-bootstrap";
import InputMask from "react-input-mask";

const SearchModal = ({
  show,
  onClose,
  filteredBills,
  searchBillNo,
  setSearchBillNo,
  searchDate,
  setSearchDate,
  onProceed,
  onSelectBill,
}) => {
  const billNoRef = useRef(null);
  const dateRef = useRef(null);
  const proceedRef = useRef(null);

  // Focus Bill No when modal opens
  useEffect(() => {
    if (show) {
      setTimeout(() => billNoRef.current?.focus(), 100);
    }
  }, [show]);

  // Generic Enter key handler to move focus
  const handleEnterKeyPress = (currentRef, nextRef) => (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          {/* Bill No Input */}
          <Form.Control
            ref={billNoRef}
            type="text"
            placeholder="Enter Bill No..."
            value={searchBillNo}
            onChange={(e) => setSearchBillNo(e.target.value)}
            onKeyDown={handleEnterKeyPress(billNoRef, dateRef)}
          />

          {/* Date InputMask */}
          <InputMask
            mask="99-99-9999"
            placeholder="DD-MM-YYYY"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className="form-control"
                ref={dateRef}
                onKeyDown={handleEnterKeyPress(dateRef, proceedRef)}
              />
            )}
          </InputMask>

          {/* Proceed Button */}
          <Button
            variant="primary"
            onClick={onProceed}
            ref={proceedRef}
          >
            Proceed
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setSearchBillNo("");
              setSearchDate("");
            }}
          >
            Clear
          </Button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Account Name</th>
                <th>Payment</th>
                <th>Receipt</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.formData.voucherno}</td>
                    <td>{bill.formData.date}</td>
                    <td>{bill.items?.[0]?.accountname}
                      {bill.items?.length > 1 ? ` + ${bill.items.length - 1} more` : ""}
                    </td>
                    <td>{bill.formData.totalpayment || bill.formData.totaldebit }</td>
                    <td>{bill.formData.totalreceipt || bill.formData.totalcredit}</td>
                    <td>
                      <Button size="sm" onClick={() => onSelectBill(bill)}>
                        Select
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No matching records
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
