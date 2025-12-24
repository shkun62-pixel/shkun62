// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Table from "react-bootstrap/Table";
// import Card from "react-bootstrap/Card";

// const API_URL =
//   "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

// const SaleSumm = () => {
//   const [rows, setRows] = useState([]);
//   const [totalSale, setTotalSale] = useState(0);

//   useEffect(() => {
//     fetchSaleSummary();
//   }, []);

//   const fetchSaleSummary = async () => {
//     const res = await axios.get(API_URL);
//     const data = res.data;

//     const saleMap = {};
//     let totalSaleValue = 0;

//     let totalCGST = 0;
//     let totalSGST = 0;
//     let totalIGST = 0;

//     data.forEach((voucher) => {
//       const { formData, items } = voucher;

//       // GST totals (voucher level)
//       totalCGST += Number(formData.cgst || 0);
//       totalSGST += Number(formData.sgst || 0);
//       totalIGST += Number(formData.igst || 0);

//       items.forEach((item) => {
//         const key = `${item.gst}_${item.Scodess}`;

//         if (!saleMap[key]) {
//           saleMap[key] = {
//             account: item.Scodess, // ✅ from API
//             qty: 0,
//             value: 0,
//             cgst: 0,
//             sgst: 0,
//             igst: 0,
//           };
//         }

//         saleMap[key].qty += Number(item.weight || 0);
//         saleMap[key].value += Number(item.amount || 0);
//         saleMap[key].cgst += Number(item.ctax || 0);
//         saleMap[key].sgst += Number(item.stax || 0);
//         saleMap[key].igst += Number(item.itax || 0);

//         totalSaleValue += Number(item.amount || 0);
//       });
//     });

//     const finalRows = [
//       ...Object.values(saleMap),

//       // GST Account Summary rows
//       {
//         account: "GST (CGST) A/c",
//         value: totalCGST,
//       },
//       {
//         account: "GST (SGST) A/c",
//         value: totalSGST,
//       },
//       {
//         account: "GST (IGST) A/c",
//         value: totalIGST,
//       },
//     ];

//     setRows(finalRows);
//     setTotalSale(totalSaleValue);
//   };

//   return (
//     <Card>
//       <Card.Header className="text-center fw-bold fs-4">
//         Sale Summary
//       </Card.Header>

//       <Card.Body style={{ padding: 0 }}>
//         <Table bordered hover size="sm">
//           <thead>
//             <tr>
//               <th>Account Name</th>
//               <th>Case/Pc</th>
//               <th className="text-end">Qty</th>
//               <th className="text-end">Value</th>
//               <th className="text-end">C.GST</th>
//               <th className="text-end">S.GST</th>
//               <th className="text-end">I.GST</th>
//               <th className="text-end">Cess</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((r, i) => (
//               <tr key={i}>
//                 <td>{r.account}</td>
//                 <td></td>
//                 <td className="text-end">
//                   {r.qty ? r.qty.toFixed(3) : ""}
//                 </td>
//                 <td className="text-end">
//                   {r.value ? r.value.toFixed(2) : ""}
//                 </td>
//                 <td className="text-end">
//                   {r.cgst ? r.cgst.toFixed(2) : ""}
//                 </td>
//                 <td className="text-end">
//                   {r.sgst ? r.sgst.toFixed(2) : ""}
//                 </td>
//                 <td className="text-end">
//                   {r.igst ? r.igst.toFixed(2) : ""}
//                 </td>
//                 <td></td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Card.Body>

//       <Card.Footer className="fw-bold">
//         Total Sale Rs. {totalSale.toFixed(2)}
//       </Card.Footer>
//     </Card>
//   );
// };

// export default SaleSumm;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import styles from "../summary.module.css";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

const SaleSumm = () => {
  const [rows, setRows] = useState([]);
  const [totalSale, setTotalSale] = useState(0);

  useEffect(() => {
    fetchSaleSummary();
  }, []);

  const fetchSaleSummary = async () => {
    const res = await axios.get(API_URL);
    const data = res.data;

    const saleMap = {};
    let totalSaleValue = 0;

    // GST Account aggregation
    const gstAccounts = {
      cgst: { name: "", value: 0 },
      sgst: { name: "", value: 0 },
      igst: { name: "", value: 0 },
    };

    data.forEach((voucher) => {
      const { formData, items } = voucher;

      // Capture account names (once is enough)
      if (!gstAccounts.cgst.name && formData.cgst_ac)
        gstAccounts.cgst.name = formData.cgst_ac;

      if (!gstAccounts.sgst.name && formData.sgst_ac)
        gstAccounts.sgst.name = formData.sgst_ac;

      if (!gstAccounts.igst.name && formData.igst_ac)
        gstAccounts.igst.name = formData.igst_ac;

      // Aggregate GST values
      gstAccounts.cgst.value += Number(formData.cgst || 0);
      gstAccounts.sgst.value += Number(formData.sgst || 0);
      gstAccounts.igst.value += Number(formData.igst || 0);

      // SALE grouping
      items.forEach((item) => {
        const key = `${item.gst}_${item.Scodess}`;

        if (!saleMap[key]) {
          saleMap[key] = {
            account: item.Scodess,
            pcs: 0,
            qty: 0,
            value: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
          };
        }

        saleMap[key].qty += Number(item.weight || 0);
        saleMap[key].pcs += Number(item.pkgs || 0);
        saleMap[key].value += Number(item.amount || 0);
        saleMap[key].cgst += Number(item.ctax || 0);
        saleMap[key].sgst += Number(item.stax || 0);
        saleMap[key].igst += Number(item.itax || 0);

        totalSaleValue += Number(item.amount || 0);
      });
    });

    const finalRows = [
      ...Object.values(saleMap),

      // GST Account rows (from API)
      {
        account: gstAccounts.cgst.name,
        value: gstAccounts.cgst.value,
      },
      {
        account: gstAccounts.sgst.name,
        value: gstAccounts.sgst.value,
      },
      {
        account: gstAccounts.igst.name,
        value: gstAccounts.igst.value,
      },
    ];

    setRows(finalRows);
    setTotalSale(totalSaleValue);
  };

  return (
    <Card className={styles.cardSumm}>
      <Card.Header className="text-center fw-bold fs-4">
        Sale Summary
      </Card.Header>

      <Card.Body style={{ padding: 0 }}>
        <Table bordered hover size="sm">
          <thead style={{ backgroundColor: "#83bcf5ff" }}>
            <tr>
              <th className="text-center">Account Name</th>
              <th className="text-center">Case/Pc</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Value</th>
              <th className="text-center">C.GST</th>
              <th className="text-center">S.GST</th>
              <th className="text-center">I.GST</th>
              <th className="text-center">Cess</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.account}</td>
                <td className="text-end">
                  {r.pcs ? r.pcs.toFixed(3) : ""}
                </td>
                <td className="text-end">
                  {r.qty ? r.qty.toFixed(3) : ""}
                </td>
                <td className="text-end">
                  {r.value ? r.value.toFixed(2) : ""}
                </td>
                <td className="text-end">
                  {r.cgst ? r.cgst.toFixed(2) : ""}
                </td>
                <td className="text-end">
                  {r.sgst ? r.sgst.toFixed(2) : ""}
                </td>
                <td className="text-end">
                  {r.igst ? r.igst.toFixed(2) : ""}
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <Card.Footer className="fw-bold">
        Total Sale Rs. {totalSale.toFixed(2)}
      </Card.Footer>
    </Card>
  );
};

export default SaleSumm;
