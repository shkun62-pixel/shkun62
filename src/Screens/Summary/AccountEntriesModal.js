// import React from "react";
// import Modal from "react-bootstrap/Modal";
// import Table from "react-bootstrap/Table";

// const AccountEntriesModal = ({
//   show,
//   onClose,
//   accountName,
//   entries,
//   formatDate,
//   report
// }) => {
//   if (!show) return null;

//   const isGSTOnly = entries.every((e) => !e.qty);

//   return (
//     <Modal show={show} onHide={onClose} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{accountName}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Table bordered size="sm">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Bill No</th>
//               <th>Customer</th>
//               {!isGSTOnly && <th>Item Name</th>}
//               {!isGSTOnly && <th>Qty</th>}
//               <th>Value</th>

//               {!isGSTOnly && (
//                 <>
//                   <th>CGST</th>
//                   <th>SGST</th>
//                   <th>IGST</th>
//                 </>
//               )}

//               <th>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {entries.map((e, i) => (
//               <tr key={i}>
//                 <td>
//                   {report === "Purchase" ? e.date : formatDate(e.date)}
//                 </td>
//                 <td>{e.vno}</td>
//                 <td>{e.customer}</td>
//                 {!isGSTOnly && (
//                   <td>{e.sdisc || ""}</td>
//                 )}
//                 {!isGSTOnly && (
//                   <td className="text-end">{e.qty || ""}</td>
//                 )}

//                 <td className="text-end">{e.value || ""}</td>

//                 {!isGSTOnly && (
//                   <>
//                     <td className="text-end">{e.cgst || ""}</td>
//                     <td className="text-end">{e.sgst || ""}</td>
//                     <td className="text-end">{e.igst || ""}</td>
//                   </>
//                 )}

//                 <td className="text-end">
//                   {e.total ?? e.value}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AccountEntriesModal;


// import React from "react";
// import Modal from "react-bootstrap/Modal";
// import Table from "react-bootstrap/Table";

// const AccountEntriesModal = ({
//   show,
//   onClose,
//   accountName,
//   entries,
//   formatDate,
//   report
// }) => {
//   if (!show) return null;

//   const isGSTOnly = entries.every((e) => !e.qty);

//   // 🔥 GROUP BY Date + Bill No + Customer
//   const grouped = {};
//   entries.forEach((e) => {
//     const key = `${e.date}_${e.vno}_${e.customer}`;
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(e);
//   });

//   return (
//     <Modal show={show} onHide={onClose} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{accountName}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Table bordered size="sm">
//           <thead style={{textAlign:'center'}}>
//             <tr>
//               <th>Date</th>
//               <th>Bill No</th>
//               <th>Customer</th>
//               {!isGSTOnly && <th>Item Name</th>}
//               {!isGSTOnly && <th>Qty</th>}
//               {!isGSTOnly && <th>Rate</th>}
//               <th>Value</th>
//               {!isGSTOnly && (
//                 <>
//                   <th>CGST</th>
//                   <th>SGST</th>
//                   <th>IGST</th>
//                 </>
//               )}
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.values(grouped).map((group, gi) =>
//               group.map((e, i) => (
//                 <tr key={`${gi}-${i}`}>
//                   {/* Show date, vno, customer only on first row */}
//                   <td>{i === 0 ? (report === "Purchase" ? e.date : formatDate(e.date)) : ""}</td>
//                   {/* <td>{i === 0 ? formatDate(e.date) : ""}</td> */}
//                   <td>{i === 0 ? e.vno : ""}</td>
//                   <td>{i === 0 ? e.customer : ""}</td>

//                   {!isGSTOnly && <td>{e.sdisc || ""}</td>}
//                   {!isGSTOnly && <td className="text-end">{e.qty || ""}</td>}
//                   {!isGSTOnly && <td className="text-end">{e.rate || ""}</td>}

//                   {/* Always show value, CGST, SGST, IGST, total */}
//                   <td className="text-end">{e.value || ""}</td>

//                   {!isGSTOnly && (
//                     <>
//                       <td className="text-end">{e.cgst || ""}</td>
//                       <td className="text-end">{e.sgst || ""}</td>
//                       <td className="text-end">{e.igst || ""}</td>
//                     </>
//                   )}

//                   <td className="text-end">{e.total || ""}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </Table>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AccountEntriesModal;


import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const AccountEntriesModal = ({
  show,
  onClose,
  accountName,
  entries,
  formatDate,
  report
}) => {
  const [activeRow, setActiveRow] = useState(0);

  const isGSTOnly = entries.every((e) => !e.qty);

  // 🔥 GROUP BY Date + Bill No + Customer
  const grouped = {};
  entries.forEach((e) => {
    const key = `${e.date}_${e.vno}_${e.customer}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  // Flatten grouped entries for keyboard navigation
  const flatEntries = Object.values(grouped).flat();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) =>
          prev < flatEntries.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const row = flatEntries[activeRow];
        if (row && row._id) {
          alert(row._id);
        } else {
          alert("No _id available for this row");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRow, flatEntries, show]);
  
  if (!show) return null;
  return (
    <Modal show={show} onHide={onClose} className="custom-modal" style={{marginTop:"10px"}}>
      <Modal.Header closeButton>
        <Modal.Title>{accountName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table bordered size="sm" className="custom-table">
          <thead style={{ textAlign: "center",backgroundColor:"skyblue" }}>
            <tr>
              <th>Date</th>
              <th>Bill No</th>
              <th>Customer</th>
              {!isGSTOnly && <th>Item Name</th>}
              {!isGSTOnly && <th>Qty</th>}
              {!isGSTOnly && <th>Rate</th>}
              <th>Value</th>
              {!isGSTOnly && (
                <>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>IGST</th>
                </>
              )}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(grouped).map((group, gi) =>
              group.map((e, i) => {
                // Calculate flat index for keyboard navigation
                const flatIndex = flatEntries.indexOf(e);

                return (
                  <tr
                    key={`${gi}-${i}`}
                    style={{
                      backgroundColor:
                        activeRow === flatIndex ? "#ffeeba" : "transparent"
                    }}
                  >
                    {/* Show date, vno, customer only on first row */}
                    <td>
                      {i === 0
                        ? report === "Purchase"
                          ? e.date
                          : formatDate(e.date)
                        : ""}
                    </td>
                    <td>{i === 0 ? e.vno : ""}</td>
                    <td>{i === 0 ? e.customer : ""}</td>

                    {!isGSTOnly && <td>{e.sdisc || ""}</td>}
                    {!isGSTOnly && (
                      <td className="text-end">{e.qty || ""}</td>
                    )}
                    {!isGSTOnly && (
                      <td className="text-end">{e.rate || ""}</td>
                    )}

                    {/* Always show value, CGST, SGST, IGST, total */}
                    <td className="text-end">{e.value || ""}</td>

                    {!isGSTOnly && (
                      <>
                        <td className="text-end">{e.cgst || ""}</td>
                        <td className="text-end">{e.sgst || ""}</td>
                        <td className="text-end">{e.igst || ""}</td>
                      </>
                    )}

                    <td className="text-end">{e.total || ""}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default AccountEntriesModal;
