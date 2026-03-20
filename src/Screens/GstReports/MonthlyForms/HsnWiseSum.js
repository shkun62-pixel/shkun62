// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import {
//   Modal,
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   CircularProgress,
//   Divider,
// } from "@mui/material";
// import useCompanySetup from "../../Shared/useCompanySetup";

// const HsnWiseSum = ({ show, handleClose, fromDate, upto }) => {

//     const {companyName, companyAdd, companyCity} = useCompanySetup();
//   const [salesData, setSalesData] = useState([]);
//   const [purchaseData, setPurchaseData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔥 DATE PARSER (IMPORTANT)
//   const parseDate = (dateStr) => {
//     if (!dateStr) return null;

//     // ISO format
//     if (dateStr.includes("T")) {
//       return new Date(dateStr);
//     }

//     // dd-mm-yyyy OR dd/mm/yyyy
//     const parts = dateStr.includes("/")
//       ? dateStr.split("/")
//       : dateStr.split("-");

//     if (parts.length === 3) {
//       return new Date(parts[2], parts[1] - 1, parts[0]);
//     }

//     return null;
//   };

//   // 🔥 FETCH API
//   useEffect(() => {
//     if (!show) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [salesRes, purchaseRes] = await Promise.all([
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
//           ),
//         ]);

//         // 🔥 FILTER HERE
//         const from = parseDate(fromDate);
//         const to = parseDate(upto);

//         const filteredSales = (salesRes.data || []).filter((sale) => {
//           const d = parseDate(sale.formData?.date);
//           return d && d >= from && d <= to;
//         });

//         const filteredPurchase = (purchaseRes.data || []).filter((pur) => {
//           const d = parseDate(pur.formData?.date);
//           return d && d >= from && d <= to;
//         });

//         setSalesData(filteredSales);
//         setPurchaseData(filteredPurchase);
//       } catch (err) {
//         console.error("API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [show, fromDate, upto]);

//   // 🔥 PROCESS DATA
//   const processHSNData = (sales = [], purchases = []) => {
//     const result = { sale: {}, purchase: {} };

//     const addData = (bucket, item) => {
//       const hsn = item.tariff || "000000";
//       const gst = item.gst || 0;
//       const key = `${hsn}_${gst}`;

//       if (!bucket[key]) {
//         bucket[key] = {
//           hsn,
//           gst,
//           qty: 0,
//           value: 0,
//           cgst: 0,
//           sgst: 0,
//           igst: 0,
//         };
//       }

//       bucket[key].qty += Number(item.weight || 0);
//       bucket[key].value += Number(item.amount || 0);
//       bucket[key].cgst += Number(item.ctax || 0);
//       bucket[key].sgst += Number(item.stax || 0);
//       bucket[key].igst += Number(item.itax || 0);
//     };

//     sales.forEach((sale) => {
//       sale.items.forEach((item) => addData(result.sale, item));
//     });

//     purchases.forEach((pur) => {
//       pur.items.forEach((item) => addData(result.purchase, item));
//     });

//     return result;
//   };

//   const getTotals = (data) => {
//     return Object.values(data).reduce(
//       (acc, item) => {
//         acc.qty += item.qty;
//         acc.value += item.value;
//         acc.cgst += item.cgst;
//         acc.sgst += item.sgst;
//         acc.igst += item.igst;
//         return acc;
//       },
//       { qty: 0, value: 0, cgst: 0, sgst: 0, igst: 0 },
//     );
//   };

//   const { sale, purchase } = useMemo(
//     () => processHSNData(salesData, purchaseData),
//     [salesData, purchaseData],
//   );

//   const saleRows = Object.values(sale);
//   const purchaseRows = Object.values(purchase);

//   const saleTotal = getTotals(sale);
//   const purchaseTotal = getTotals(purchase);

//   const renderRows = (rows) =>
//     rows.map((row, i) => (
//       <TableRow key={i}>
//         <TableCell>{row.hsn}</TableCell>
//         <TableCell>{row.gst}</TableCell>
//         <TableCell>0</TableCell>
//         <TableCell>{row.qty.toFixed(3)}</TableCell>
//         <TableCell>{row.value.toFixed(2)}</TableCell>
//         <TableCell>{row.cgst.toFixed(2)}</TableCell>
//         <TableCell>{row.sgst.toFixed(2)}</TableCell>
//         <TableCell>{row.igst.toFixed(2)}</TableCell>
//         <TableCell>0</TableCell>
//       </TableRow>
//     ));

//   return (
//     <Modal open={show} onClose={handleClose}>
//       <Box
//         sx={{
//           width: "95%",
//           height: "90vh",
//           bgcolor: "background.paper",
//           margin: "auto",
//           mt: 3,
//           borderRadius: 3,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         {/* 🔥 HEADER (FIXED) */}
//         <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
//           <Typography variant="h5" align="center" fontWeight="bold">
//             {companyName}
//           </Typography>
//           <Typography align="center">{companyAdd}</Typography>
//           <Typography align="center">{companyCity}</Typography>

//           <Divider sx={{ my: 1 }} />

//           <Typography align="center">
//             HSN Detail From {fromDate} To {upto}
//           </Typography>
//         </Box>

//         {/* 🔥 BODY (SCROLLABLE) */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//             p: 2,
//           }}
//         >
//           {loading ? (
//             <Box display="flex" justifyContent="center" mt={5}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <>
//               {/* SALE */}
//               <Typography color="error" fontWeight="bold" mb={1}>
//                 SALE
//               </Typography>

//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>HSN</TableCell>
//                     <TableCell>Gst %</TableCell>
//                     <TableCell>Pcs</TableCell>
//                     <TableCell>Qty</TableCell>
//                     <TableCell>Value</TableCell>
//                     <TableCell>C.Gst</TableCell>
//                     <TableCell>S.Gst</TableCell>
//                     <TableCell>I.Gst</TableCell>
//                     <TableCell>Cess</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {renderRows(saleRows)}
//                   <TableRow sx={{ fontWeight: "bold" }}>
//                     <TableCell colSpan={3}>Total</TableCell>
//                     <TableCell>{saleTotal.qty.toFixed(3)}</TableCell>
//                     <TableCell>{saleTotal.value.toFixed(2)}</TableCell>
//                     <TableCell>{saleTotal.cgst.toFixed(2)}</TableCell>
//                     <TableCell>{saleTotal.sgst.toFixed(2)}</TableCell>
//                     <TableCell>{saleTotal.igst.toFixed(2)}</TableCell>
//                     <TableCell>0</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>

//               <Divider sx={{ my: 2 }} />

//               {/* PURCHASE */}
//               <Typography color="error" fontWeight="bold" mb={1}>
//                 PURCHASE
//               </Typography>

//               <Table size="small">
//                 <TableBody>
//                   {renderRows(purchaseRows)}
//                   <TableRow sx={{ fontWeight: "bold" }}>
//                     <TableCell colSpan={3}>Total</TableCell>
//                     <TableCell>{purchaseTotal.qty.toFixed(3)}</TableCell>
//                     <TableCell>{purchaseTotal.value.toFixed(2)}</TableCell>
//                     <TableCell>{purchaseTotal.cgst.toFixed(2)}</TableCell>
//                     <TableCell>{purchaseTotal.sgst.toFixed(2)}</TableCell>
//                     <TableCell>{purchaseTotal.igst.toFixed(2)}</TableCell>
//                     <TableCell>0</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </>
//           )}
//         </Box>

//         {/* 🔥 FOOTER (FIXED) */}
//         <Box
//           sx={{
//             p: 2,
//             borderTop: "1px solid #ddd",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Button style={{ marginLeft:"auto" }} variant="contained" color="error" onClick={handleClose}>
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default HsnWiseSum;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import Table from "react-bootstrap/Table";
import useCompanySetup from "../../Shared/useCompanySetup";

const HsnWiseSum = ({ show, handleClose, fromDate, upto }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();

  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("sale");

  // DATE PARSER
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("T")) return new Date(dateStr);

    const parts = dateStr.includes("/")
      ? dateStr.split("/")
      : dateStr.split("-");

    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  // FETCH + FILTER
  useEffect(() => {
    if (!show) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [salesRes, purchaseRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
          ),
        ]);

        const from = parseDate(fromDate);
        const to = parseDate(upto);

        setSalesData(
          salesRes.data.filter((s) => {
            const d = parseDate(s.formData?.date);
            return d && d >= from && d <= to;
          }),
        );

        setPurchaseData(
          purchaseRes.data.filter((p) => {
            const d = parseDate(p.formData?.date);
            return d && d >= from && d <= to;
          }),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, fromDate, upto]);

  // PROCESS
  const processHSNData = (sales = [], purchases = []) => {
    const result = { sale: {}, purchase: {} };

    const add = (bucket, item) => {
      const key = `${item.tariff}_${item.gst}`;

      if (!bucket[key]) {
        bucket[key] = {
          hsn: item.tariff,
          gst: item.gst,
          pcs: 0,
          qty: 0,
          value: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
        };
      }

      bucket[key].pcs += Number(item.pkgs || 0);
      bucket[key].qty += Number(item.weight || 0);
      bucket[key].value += Number(item.amount || 0);
      bucket[key].cgst += Number(item.ctax || 0);
      bucket[key].sgst += Number(item.stax || 0);
      bucket[key].igst += Number(item.itax || 0);
    };

    sales.forEach((s) => s.items.forEach((i) => add(result.sale, i)));
    purchases.forEach((p) => p.items.forEach((i) => add(result.purchase, i)));

    return result;
  };

  const getTotals = (data) =>
    Object.values(data).reduce(
      (a, i) => ({
        pcs: a.pcs + i.pcs,
        qty: a.qty + i.qty,
        value: a.value + i.value,
        cgst: a.cgst + i.cgst,
        sgst: a.sgst + i.sgst,
        igst: a.igst + i.igst,
      }),
      { pcs:0, qty: 0, value: 0, cgst: 0, sgst: 0, igst: 0 },
    );

  const { sale, purchase } = useMemo(
    () => processHSNData(salesData, purchaseData),
    [salesData, purchaseData],
  );

  const saleRows = Object.values(sale);
  const purchaseRows = Object.values(purchase);

  const saleTotal = getTotals(sale);
  const purchaseTotal = getTotals(purchase);

  const renderTable = (rows, total) => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      {/* SCROLLABLE BODY */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Table bordered hover size="sm" style={{ marginBottom: 0 }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "#f5f5f5",
              zIndex: 2,
            }}
          >
            <tr>
              <th className="text-center">HSN</th>
              <th className="text-center">GST %</th>
              <th className="text-center">PCS</th>
              <th className="text-center">QTY</th>
              <th className="text-center">VALUE</th>
              <th className="text-center">C.GST</th>
              <th className="text-center">S.GST</th>
              <th className="text-center">I.GST</th>
              <th className="text-center">CESS</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.hsn}</td>
                <td className="text-end">{r.gst.toFixed(2)}</td>
                <td className="text-end">
                  {Number(r.pcs) === 0 ? "" : r.pcs.toFixed(3)}
                </td>
                <td className="text-end">
                  {Number(r.qty) === 0 ? "" : r.qty.toFixed(3)}
                </td>
                <td className="text-end">
                  {Number(r.value) === 0 ? "" : r.value.toFixed(2)}
                </td>
                <td className="text-end">
                  {Number(r.cgst) === 0 ? "" : r.cgst.toFixed(2)}
                </td>
                <td className="text-end">
                  {Number(r.sgst) === 0 ? "" : r.sgst.toFixed(2)}
                </td>
                <td className="text-end">
                  {Number(r.igst) === 0 ? "" : r.igst.toFixed(2)}
                </td>
                <td className="text-end"></td>
              </tr>
            ))}
          </tbody>

          {/* ✅ FOOTER (SAME TABLE = PERFECT ALIGNMENT) */}
          <tfoot
            style={{
              position: "sticky",
              bottom: 0,
              background: "#f0f0f0",
              fontWeight: "bold",
              color:"red",
            }}
          >
            <tr>
              <td>Total</td>
              <td></td>
              <td className="text-end">{total.pcs.toFixed(3)}</td>
              <td className="text-end">{total.qty.toFixed(3)}</td>
              <td className="text-end">{total.value.toFixed(2)}</td>
              <td className="text-end">{total.cgst.toFixed(2)}</td>
              <td className="text-end">{total.sgst.toFixed(2)}</td>
              <td className="text-end">{total.igst.toFixed(2)}</td>
              <td className="text-end"></td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );

  return (
    <Modal open={show} onClose={handleClose}>
      <Box
        sx={{
          width: "95%",
          height: "90vh",
          bgcolor: "#fff",
          m: "auto",
          mt: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box sx={{ textAlign: "center", p: 1.5, }}>
          <Typography fontWeight="bold">{companyName}</Typography>
          <Typography variant="body2">{companyAdd}</Typography>
          <Typography variant="body2">{companyCity}</Typography>

          <Typography mt={1} fontWeight="bold" variant="body2">
            HSN Detail From {fromDate} To {upto}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* 🔥 TOGGLE */}
          <Box
            sx={{
              display: "flex",
              background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
              borderRadius: "40px",
              padding: "4px",
              width: "260px",
              margin: "auto",
            }}
          >
            {[
              { label: "SALE", value: "sale" },
              { label: "PURCHASE", value: "purchase" },
            ].map((item) => (
              <Box
                key={item.value}
                onClick={() => setView(item.value)}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  borderRadius: "40px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",

                  color: view === item.value ? "#7b2ff7" : "#fff",
                  backgroundColor: view === item.value ? "#fff" : "transparent",

                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* BODY */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              width: "200%",
              height: "100%",
              transform: `translateX(${view === "sale" ? "0%" : "-50%"})`,
              transition: "transform 0.4s ease",
            }}
          >
            <Box sx={{ width: "50%", p: 2, overflowY: "auto" }}>
              {loading ? (
                <CircularProgress />
              ) : (
                renderTable(saleRows, saleTotal)
              )}
            </Box>

            <Box sx={{ width: "50%", p: 2, overflowY: "auto" }}>
              {loading ? (
                <CircularProgress />
              ) : (
                renderTable(purchaseRows, purchaseTotal)
              )}
            </Box>
          </Box>
        </Box>

        {/* FOOTER */}
        <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{ float: "right" }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HsnWiseSum;
