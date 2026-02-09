// import React, { useEffect, useState } from "react";
// import { Modal, Button, Table, Spinner,  } from "react-bootstrap";

// /* =======================
//    API URLS
// ======================= */
// const SALE_API =
//   "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

// const PURCHASE_API =
//   "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

// /* =======================
//    DATE HELPERS
// ======================= */
// const parseDDMMYYYY = (str) => {
//   if (!str) return null;
//   const [dd, mm, yyyy] = str.split("-");
//   return new Date(`${yyyy}-${mm}-${dd}`);
// };

// const parseAnyDate = (date) => {
//   if (!date) return null;

//   // ISO date (Sale API)
//   if (date.includes("T")) return new Date(date);

//   // DD-MM-YYYY (Purchase API)
//   return parseDDMMYYYY(date);
// };

// /* =======================
//    COMPONENT
// ======================= */
// const AcwiseGstPreviewModal = ({ show, onHide, filters }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* =======================
//      FETCH + FILTER DATA
//   ======================= */
//   useEffect(() => {
//     if (!show || !filters) return;
//     fetchData();
//     // eslint-disable-next-line
//   }, [show, filters]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       let combined = [];

//       /* -------- SALE -------- */
//       if (filters.reportType === "Sale" || filters.reportType === "All") {
//         const res = await fetch(SALE_API);
//         const sale = await res.json();

//         combined.push(
//           ...sale.map((d) => ({
//             ...d,
//             _type: "SALE",
//           }))
//         );
//       }

//       /* -------- PURCHASE -------- */
//       if (filters.reportType === "Purchase" || filters.reportType === "All") {
//         const res = await fetch(PURCHASE_API);
//         const purchase = await res.json();

//         combined.push(
//           ...purchase.map((d) => ({
//             ...d,
//             _type: "PURCHASE",
//           }))
//         );
//       }

//       /* -------- FILTERING -------- */
//       const from = parseDDMMYYYY(filters.fromDate);
//       const upto = parseDDMMYYYY(filters.uptoDate);

//       const filtered = combined.filter((row) => {
//         const rowDate = parseAnyDate(row.formData.date);
//         if (!rowDate) return false;

//         // Date range
//         if (rowDate < from || rowDate > upto) return false;

//         // B2B / B2C
//         const party =
//           row.customerDetails?.[0] || row.supplierdetails?.[0];
//         const gstno = party?.gstno;

//         if (filters.b2bType === "B2B" && !gstno) return false;
//         if (filters.b2bType === "B2C" && gstno) return false;

//         return true;
//       });

//       setRows(filtered);
//     } catch (err) {
//       console.error("GST Preview Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================
//      RENDER
//   ======================= */
//   return (
//     <Modal show={show} onHide={onHide} size="xl" centered backdrop="static" className="custom-modal"
//       style={{ marginTop: 10 }} >
//       <Modal.Header closeButton>
//         <Modal.Title>GST Rate Wise Purchase Account Summary</Modal.Title>
//       </Modal.Header>

//       <Modal.Body style={{ overflowY: "auto" }}>
//         {loading ? (
//           <div className="text-center my-4">
//             <Spinner animation="border" />
//           </div>
//         ) : rows.length === 0 ? (
//           <p className="text-center">No records found</p>
//         ) : (
//           <Table bordered hover size="sm">
//             <thead>
//               <tr>
//                 <th>Type</th>
//                 <th>Date</th>
//                 <th>Bill No</th>
//                 <th>Party Name</th>
//                 <th>GST No</th>
//                 <th>Tax</th>
//                 <th>Grand Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row) => {
//                 const party =
//                   row.customerDetails?.[0] ||
//                   row.supplierdetails?.[0];

//                 return (
//                   <tr key={row._id}>
//                     <td>{row._type}</td>
//                     <td>{row.formData.duedate || row.formData.date}</td>
//                     <td>{row.formData.vbillno || row.formData.vno}</td>
//                     <td>{party?.vacode}</td>
//                     <td>{party?.gstno || "B2C"}</td>
//                     <td>{row.formData.tax}</td>
//                     <td>{row.formData.grandtotal}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         )}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="primary" onClick={() => window.print()}>
//           PRINT
//         </Button>
//         <Button variant="secondary" onClick={onHide}>
//           CLOSE
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default AcwiseGstPreviewModal;

import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import useCompanySetup from "../../Shared/useCompanySetup";

const SALE_API =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

const PURCHASE_API =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

const parseDDMMYYYY = (str) => {
  if (!str) return null;
  const [dd, mm, yyyy] = str.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
};

const parseAnyDate = (date) => {
  if (!date) return null;
  if (date.includes("T")) return new Date(date);
  return parseDDMMYYYY(date);
};

/* =======================
   COMPONENT
======================= */
const AcwiseGstPreviewModal = ({ show, onHide, filters }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const printRef = useRef();
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({
    value: 0,
    taxable: 0,
    ctax: 0,
    stax: 0,
    itax: 0,
    cess: 0,
  });
  const [loading, setLoading] = useState(false);

  /* =======================
     FETCH + FILTER + GROUP
  ======================= */
  useEffect(() => {
    if (!show || !filters) return;
    fetchData();
    // eslint-disable-next-line
  }, [show, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let combined = [];

      /* -------- SALE -------- */
      if (filters.reportType === "Sale") {
        const res = await fetch(SALE_API);
        const sale = await res.json();
        combined = sale.map((d) => ({ ...d, _type: "SALE" }));
      }

      /* -------- PURCHASE -------- */
      if (filters.reportType === "Purchase") {
        const res = await fetch(PURCHASE_API);
        const purchase = await res.json();
        combined = purchase.map((d) => ({ ...d, _type: "PURCHASE" }));
      }

      /* -------- DATE + B2B FILTER -------- */
      const from = parseDDMMYYYY(filters.fromDate);
      const upto = parseDDMMYYYY(filters.uptoDate);

      const filtered = combined.filter((row) => {
        const rowDate = parseAnyDate(row.formData.date);
        if (!rowDate) return false;
        if (rowDate < from || rowDate > upto) return false;

        const party = row.customerDetails?.[0] || row.supplierdetails?.[0];
        const gstno = party?.gstno;

        if (filters.b2bType === "B2B" && !gstno) return false;
        if (filters.b2bType === "B2C" && gstno) return false;

        return true;
      });

      /* -------- GROUP BY ACCOUNT + GST -------- */
      const map = {};
      const grand = {
        value: 0,
        taxable: 0,
        ctax: 0,
        stax: 0,
        itax: 0,
        cess: 0,
      };

      filtered.forEach((doc) => {
        doc.items?.forEach((it) => {
          const accCode =
            filters.reportType === "Sale" ? it.Scodes01 : it.Pcodes01;

          const accName =
            filters.reportType === "Sale" ? it.Scodess : it.Pcodess;

          if (!accCode) return;

          const key = `${accCode}_${it.gst}`;

          if (!map[key]) {
            map[key] = {
              accName,
              gst: Number(it.gst || 0),
              value: 0,
              taxable: 0,
              ctax: 0,
              stax: 0,
              itax: 0,
              cess: 0,
            };
          }

          const amt = Number(it.amount || 0);
          const ctax = Number(it.ctax || 0);
          const stax = Number(it.stax || 0);
          const itax = Number(it.itax || 0);

          map[key].value += amt;
          map[key].taxable += amt;
          map[key].ctax += ctax;
          map[key].stax += stax;
          map[key].itax += itax;

          grand.value += amt;
          grand.taxable += amt;
          grand.ctax += ctax;
          grand.stax += stax;
          grand.itax += itax;
        });
      });

      setRows(Object.values(map));
      setTotals(grand);
    } catch (err) {
      console.error("GST Preview Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=1200,height=800");

    WinPrint.document.write(`
        <html>
        <head>
        <title>GST Account Wise Report</title>
        <style>
            @page { size: A4 ; }
            body { font-family: serif; font-size: 12px; }
            .print-header { text-align: center; margin-bottom: 14px; }
            .company-name { font-size: 16px; font-weight: bold; }
            .company-address, .company-city { font-size: 12px; }
            .report-title { margin-top: 6px; font-size: 13px; font-weight: bold; 
            display: flex;
             justify-content: space-between; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 4px; font-size: 11px; }
            th { background: #f0f0f0; text-align: center; }
            .text-end { text-align: right; }
        </style>
        </head>
        <body>
        <div class="print-header">
            <div class="company-name">${companyName}</div>
            <div class="company-address">${companyAdd}</div>
            <div class="company-city">${companyCity}</div>
        </div>
        <div class="report-title">
            <a>GST RATE WISE ${filters.reportType.toUpperCase()} ACCOUNT SUMMARY</a>
            <a>Period From ${filters.fromDate} To Upto ${filters.uptoDate}</a>
        </div>
    `);

    WinPrint.document.write(printRef.current.innerHTML);
    WinPrint.document.write("</body></html>");

    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  if (!show) return null; // ✅ SAFE — after hooks

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          GST Rate Wise {filters.reportType} Account Summary
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center">No records found</p>
        ) : (
          <div ref={printRef}>
            <Table bordered size="sm" className="custom-table">
              <thead style={{ background: "#dedcd7" }}>
                <tr>
                  <th className="text-center">A/c Name</th>
                  <th className="text-end">GST %</th>
                  <th className="text-end">Value</th>
                  <th className="text-end">Others</th>
                  <th className="text-end">Taxable</th>
                  <th className="text-end">C.Tax</th>
                  <th className="text-end">S.Tax</th>
                  <th className="text-end">I.Tax</th>
                  <th className="text-end">Cess</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.accName}</td>
                    <td className="text-end">{r.gst.toFixed(2)}</td>
                    <td className="text-end">{r.value.toFixed(2)}</td>
                    <td></td>
                    <td className="text-end">{r.taxable.toFixed(2)}</td>
                    <td className="text-end">{r.ctax.toFixed(2)}</td>
                    <td className="text-end">{r.stax.toFixed(2)}</td>
                    <td className="text-end">{r.itax.toFixed(2)}</td>
                    <td className="text-end">0.00</td>
                  </tr>
                ))}

                <tr style={{ fontWeight: "bold" }}>
                  <td>Total</td>
                  <td></td>
                  <td className="text-end">{totals.value.toFixed(2)}</td>
                  <td></td>
                  <td className="text-end">{totals.taxable.toFixed(2)}</td>
                  <td className="text-end">{totals.ctax.toFixed(2)}</td>
                  <td className="text-end">{totals.stax.toFixed(2)}</td>
                  <td className="text-end">{totals.itax.toFixed(2)}</td>
                  <td className="text-end">0.00</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handlePrint}>
          PRINT
        </Button>
        <Button variant="secondary" onClick={onHide}>
          CLOSE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AcwiseGstPreviewModal;
