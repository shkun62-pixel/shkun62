import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../../Summary/summary.module.css";
import InputMask from "react-input-mask";
import financialYear from "../../Shared/financialYear";
import AccountEntriesModal from "../../Summary/AccountEntriesModal";
import PrintSummary from "../../Summary/PrintSummary";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

const TaxWiseSale = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [allVouchers, setAllVouchers] = useState([]);
  const [showPrint, setShowPrint] = useState(false);

  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [taxType, setTaxType] = useState("All");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start)); // converted
    setToDate(formatDate(fy.end)); // converted
  }, []);

  const [rows, setRows] = useState([]);
  const [totalSale, setTotalSale] = useState(0);

  // handles dd-mm-yyyy / dd/mm/yyyy / yyyy-mm-dd
  const parseAnyDate = (dateStr) => {
    if (!dateStr) return null;

    // ✅ ISO date with time (API format)
    if (dateStr.includes("T")) {
      const d = new Date(dateStr);
      return isNaN(d) ? null : d;
    }

    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const d = new Date(dateStr);
      return isNaN(d) ? null : d;
    }

    // dd-mm-yyyy or dd/mm/yyyy
    const parts = dateStr.includes("-")
      ? dateStr.split("-")
      : dateStr.split("/");

    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      const d = new Date(yyyy, mm - 1, dd);
      return isNaN(d) ? null : d;
    }

    return null;
  };

  const isDateInRange = (voucherDate, fromDate, toDate) => {
    const vDate = parseAnyDate(voucherDate);
    const fDate = parseAnyDate(fromDate);
    const tDate = parseAnyDate(toDate);

    if (!vDate || !fDate || !tDate) return false;

    // 🔥 Normalize times
    vDate.setHours(0, 0, 0, 0);
    fDate.setHours(0, 0, 0, 0);
    tDate.setHours(23, 59, 59, 999);

    return vDate >= fDate && vDate <= tDate;
  };

  useEffect(() => {
    fetchSaleSummary();
  }, [fromDate, toDate, taxType]);

  const fetchSaleSummary = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = res.data;

      setAllVouchers(data);

      const saleMap = {};
      let totalSaleValue = 0;

      data.forEach((voucher) => {
        const { formData, items } = voucher;

        // DATE FILTER
        if (!isDateInRange(formData.date, fromDate, toDate)) return;

        // TAX TYPE FILTER
        if (taxType !== "All" && formData.stype !== taxType) return;

        // ✅ ONLY SCODESS ACCOUNTS
        items.forEach((item) => {
          if (!item.Scodes01) return;

          const key = item.Scodes01;

          if (!saleMap[key]) {
            saleMap[key] = {
              accountCode: item.Scodes01, // 🔒 used for logic
              accountName: item.Scodess, // 👁 used only for display
              pcs: 0,
              qty: 0,
              value: 0,
              cgst: 0,
              sgst: 0,
              igst: 0,
            };
          }

          saleMap[key].pcs += Number(item.pkgs || 0);
          saleMap[key].qty += Number(item.weight || 0);
          saleMap[key].value += Number(item.amount || 0);
          saleMap[key].cgst += Number(item.ctax || 0);
          saleMap[key].sgst += Number(item.stax || 0);
          saleMap[key].igst += Number(item.itax || 0);

          totalSaleValue += Number(item.amount || 0);
        });
      });

      setRows(Object.values(saleMap)); // ✅ ONLY SCODESS
      setTotalSale(totalSaleValue);
    } catch (error) {
      console.error("Error fetching sale summary:", error);
    }
  };

  const getAccountEntries = () => {
    if (!selectedAccount) return [];

    const entries = [];

    allVouchers.forEach((voucher) => {
      const { formData, items, customerDetails } = voucher;
      const customer = customerDetails?.[0]?.vacode || "";

      // 🔹 SALE ACCOUNT ENTRIES
      items.forEach((item) => {
        if (item.Scodes01 === selectedAccount) {
          entries.push({
            _id: voucher._id,
            type: "SALE",
            date: formData.date,
            vno: formData.vbillno,
            customer,
            sdisc: item.sdisc,
            pcs: item.pkgs,
            qty: item.weight,
            rate: item.rate,
            value: item.amount,
            cgst: item.ctax,
            sgst: item.stax,
            igst: item.itax,
            total: item.vamt,
          });
        }
      });
    });

    // 🔹 Sort by Date + Voucher No
    entries.sort((a, b) => {
      const d1 = parseAnyDate(a.date);
      const d2 = parseAnyDate(b.date);
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return a.vno.toString().localeCompare(b.vno.toString());
    });

    return entries;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) return;
      if (!rows.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) => (prev < rows.length - 1 ? prev + 1 : prev));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const row = rows[activeRow];
        if (row?.accountCode) {
          setSelectedAccount(row.accountCode); // 🔒 always stable
          setShowModal(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rows, activeRow, showModal]);

  useEffect(() => {
    if (!showModal) return;

    const esc = (e) => e.key === "Escape" && setShowModal(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [showModal]);

  const MIN_ROWS = 8;

  const displayRows = [...rows];

  if (displayRows.length < MIN_ROWS) {
    const emptyCount = MIN_ROWS - displayRows.length;

    for (let i = 0; i < emptyCount; i++) {
      displayRows.push({
        account: "",
        pcs: "",
        qty: "",
        value: "",
        cgst: "",
        sgst: "",
        igst: "",
        isEmpty: true, // 👈 flag
      });
    }
  }

  return (
    <div className={styles.cardContainer}>
      <Card className={styles.cardSumm}>
        <h1 className={styles.headerSummary}>SALE TAX SUMMARY</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <InputMask
            mask="99-99-9999"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          >
            {(props) => (
              <TextField
                className="custom-bordered-input"
                {...props}
                label="FROM"
                size="small"
                variant="filled"
                fullWidth
                style={{ width: 200 }}
              />
            )}
          </InputMask>
          <InputMask
            mask="99-99-9999"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          >
            {(props) => (
              <TextField
                className="custom-bordered-input"
                {...props}
                label="UPTO"
                size="small"
                variant="filled"
                fullWidth
                style={{ marginLeft: 20, width: 200 }}
              />
            )}
          </InputMask>

          <div style={{ width: 300, marginLeft: 20 }}>
            <FormControl
              className="custom-bordered-input"
              variant="filled"
              fullWidth
              size="small"
            >
              <InputLabel>Tax Type</InputLabel>
              <Select
                className="custom-bordered-input"
                value={taxType}
                label="Tax Type"
                onChange={(e) => setTaxType(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
                <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
                <MenuItem value="GST (URD)">GST (URD)</MenuItem>
                <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
                <MenuItem value="Tax Free Within State">
                  Tax Free Within State
                </MenuItem>
                <MenuItem value="Tax Free Interstate">
                  Tax Free Interstate
                </MenuItem>
                <MenuItem value="Export Sale">Export Sale</MenuItem>
                <MenuItem value="Export Sale(IGST)">Export Sale(IGST)</MenuItem>
                <MenuItem value="Including GST">Including GST</MenuItem>
                <MenuItem value="Including IGST">Including IGST</MenuItem>
                <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.tables} style={{ padding: 0 }}>
          <Table className="custom-table" size="sm">
            <thead style={{ backgroundColor: "#83bcf5ff" }}>
              <tr>
                <th className="text-center">Account Name</th>
                <th className="text-center">Case/Pcs</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Value</th>
                <th className="text-center">C.GST</th>
                <th className="text-center">S.GST</th>
                <th className="text-center">I.GST</th>
                <th className="text-center">Cess</th>
              </tr>
            </thead>

            <tbody>
              {displayRows.map((r, i) => (
                <tr
                  key={i}
                  className={
                    !r.isEmpty && i === activeRow ? styles.activeRow : ""
                  }
                  style={{ height: 32 }}
                >
                  <td>{r.accountName}</td>
                  <td className="text-end">
                    {r.pcs !== "" ? Number(r.pcs).toFixed(3) : ""}
                  </td>
                  <td className="text-end">
                    {r.qty !== "" ? Number(r.qty).toFixed(3) : ""}
                  </td>
                  <td className="text-end">
                    {r.value !== "" ? Number(r.value).toFixed(2) : ""}
                  </td>
                  <td className="text-end">
                    {r.cgst !== "" ? Number(r.cgst).toFixed(2) : ""}
                  </td>
                  <td className="text-end">
                    {r.sgst !== "" ? Number(r.sgst).toFixed(2) : ""}
                  </td>
                  <td className="text-end">
                    {r.igst !== "" ? Number(r.igst).toFixed(2) : ""}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Card.Footer className="fw-bold" style={{ fontSize: "20px",display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
          Total Sale Rs. {totalSale.toFixed(2)}
          <Button
            style={{ letterSpacing: 2 }}
            onClick={() => setShowPrint(true)}
          >
            PRINT
          </Button>
        </Card.Footer>
      </Card>
      <PrintSummary
        isOpen={showPrint}
        handleClose={() => setShowPrint(false)}
        rows={rows}
        totalSale={totalSale}
        fromDate={formatDate(fromDate)}
        toDate={toDate}
        header={"Sale TaxWise Summary"}
        Total={"Total Sale Rs"}
      />
      <AccountEntriesModal
        show={showModal}
        onClose={() => setShowModal(false)}
        accountCode={selectedAccount}
        accountName={
          rows.find((r) => r.accountCode === selectedAccount)?.accountName
        }
        entries={getAccountEntries()}
        fromDate={fromDate}
        uptoDate={toDate}
      />
    </div>
  );
};

export default TaxWiseSale;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Table from "react-bootstrap/Table";
// import { Button } from "react-bootstrap";
// import Card from "react-bootstrap/Card";
// import styles from "../../Summary/summary.module.css";
// import InputMask from "react-input-mask";
// import financialYear from "../../Shared/financialYear";
// import AccountEntriesModal from "../../Summary/AccountEntriesModal";
// import PrintSummary from "../../Summary/PrintSummary";
// import { TextField } from "@mui/material";
// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// const API_URL =
//   "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

// const TaxWiseSale = () => {
//   const [activeRow, setActiveRow] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [allVouchers, setAllVouchers] = useState([]);
//   const [showPrint, setShowPrint] = useState(false);

//   // filters
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [taxType, setTaxType] = useState("All");

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
//     setToDate(formatDate(fy.end)); // converted
//   }, []);

//   const [rows, setRows] = useState([]);
//   const [totalSale, setTotalSale] = useState(0);

//   // handles dd-mm-yyyy / dd/mm/yyyy / yyyy-mm-dd
//   const parseAnyDate = (dateStr) => {
//     if (!dateStr) return null;

//     // ✅ ISO date with time (API format)
//     if (dateStr.includes("T")) {
//       const d = new Date(dateStr);
//       return isNaN(d) ? null : d;
//     }

//     // yyyy-mm-dd
//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
//       const d = new Date(dateStr);
//       return isNaN(d) ? null : d;
//     }

//     // dd-mm-yyyy or dd/mm/yyyy
//     const parts = dateStr.includes("-")
//       ? dateStr.split("-")
//       : dateStr.split("/");

//     if (parts.length === 3) {
//       const [dd, mm, yyyy] = parts;
//       const d = new Date(yyyy, mm - 1, dd);
//       return isNaN(d) ? null : d;
//     }

//     return null;
//   };

//   const isDateInRange = (voucherDate, fromDate, toDate) => {
//     const vDate = parseAnyDate(voucherDate);
//     const fDate = parseAnyDate(fromDate);
//     const tDate = parseAnyDate(toDate);

//     if (!vDate || !fDate || !tDate) return false;

//     // 🔥 Normalize times
//     vDate.setHours(0, 0, 0, 0);
//     fDate.setHours(0, 0, 0, 0);
//     tDate.setHours(23, 59, 59, 999);

//     return vDate >= fDate && vDate <= tDate;
//   };

//   useEffect(() => {
//     fetchSaleSummary();
//   }, [fromDate, toDate, taxType]);

//   const fetchSaleSummary = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       const data = res.data;

//       setAllVouchers(data);

//       const saleMap = {};
//       let totalSaleValue = 0;

//       data.forEach((voucher) => {
//         const { formData, items } = voucher;

//         // DATE FILTER
//         if (!isDateInRange(formData.date, fromDate, toDate)) return;

//         // TAX TYPE FILTER
//         if (taxType !== "All" && formData.stype !== taxType) return;

//         // ✅ ONLY SCODESS ACCOUNTS
//         items.forEach((item) => {
//           if (!item.Scodess) return;

//           const key = item.Scodess;

//           if (!saleMap[key]) {
//             saleMap[key] = {
//               account: item.Scodess,
//               pcs: 0,
//               qty: 0,
//               value: 0,
//               cgst: 0,
//               sgst: 0,
//               igst: 0,
//             };
//           }

//           saleMap[key].pcs += Number(item.pkgs || 0);
//           saleMap[key].qty += Number(item.weight || 0);
//           saleMap[key].value += Number(item.amount || 0);
//           saleMap[key].cgst += Number(item.ctax || 0);
//           saleMap[key].sgst += Number(item.stax || 0);
//           saleMap[key].igst += Number(item.itax || 0);

//           totalSaleValue += Number(item.amount || 0);
//         });
//       });

//       setRows(Object.values(saleMap)); // ✅ ONLY SCODESS
//       setTotalSale(totalSaleValue);
//     } catch (error) {
//       console.error("Error fetching sale summary:", error);
//     }
//   };

//   const getAccountEntries = () => {
//     if (!selectedAccount) return [];

//     const entries = [];

//     allVouchers.forEach((voucher) => {
//       const { formData, items, customerDetails } = voucher;
//       const customer = customerDetails?.[0]?.vacode || "";

//       // 🔹 SALE ACCOUNT ENTRIES
//       items.forEach((item) => {
//         if (item.Scodess === selectedAccount) {
//           entries.push({
//             _id: voucher._id,
//             type: "SALE",
//             date: formData.date,
//             vno: formData.vbillno,
//             customer,
//             sdisc: item.sdisc,
//             pcs: item.pkgs,
//             qty: item.weight,
//             rate: item.rate,
//             value: item.amount,
//             cgst: item.ctax,
//             sgst: item.stax,
//             igst: item.itax,
//             total: item.vamt,
//           });
//         }
//       });
//     });

//     // 🔹 Sort by Date + Voucher No
//     entries.sort((a, b) => {
//       const d1 = parseAnyDate(a.date);
//       const d2 = parseAnyDate(b.date);
//       if (d1 < d2) return -1;
//       if (d1 > d2) return 1;
//       return a.vno.toString().localeCompare(b.vno.toString());
//     });

//     return entries;
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (showModal) return;
//       if (!rows.length) return;

//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         setActiveRow((prev) => (prev < rows.length - 1 ? prev + 1 : prev));
//       }

//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
//       }

//       if (e.key === "Enter") {
//         e.preventDefault();
//         const row = rows[activeRow];
//         if (row?.account) {
//           setSelectedAccount(row.account);
//           setShowModal(true);
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [rows, activeRow, showModal]);

//   useEffect(() => {
//     if (!showModal) return;

//     const esc = (e) => e.key === "Escape" && setShowModal(false);
//     window.addEventListener("keydown", esc);
//     return () => window.removeEventListener("keydown", esc);
//   }, [showModal]);

//   return (
//     <div className={styles.cardContainer}>
//       <Card className={styles.cardSumm}>
//         <h1 className={styles.headerSummary}>SALE TAX SUMMARY</h1>
//         <div style={{display:'flex',flexDirection:'row',marginBottom:10,marginTop:10}}>
//             <InputMask
//               mask="99-99-9999"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             >
//               {(props) => (
//                 <TextField
//                 className="custom-bordered-input"
//                   {...props}
//                   label="FROM"
//                   size="small"
//                   variant="filled"
//                   fullWidth
//                   style={{ width:200}}
//                 />
//               )}
//             </InputMask>
//             <InputMask
//               mask="99-99-9999"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             >
//               {(props) => (
//                 <TextField
//                 className="custom-bordered-input"
//                   {...props}
//                   label="UPTO"
//                   size="small"
//                   variant="filled"
//                   fullWidth
//                   style={{marginLeft:20, width:200}}
//                 />
//               )}
//             </InputMask>

//           <div style={{width:300, marginLeft:20}}>
//             <FormControl className="custom-bordered-input" variant="filled" fullWidth size="small">
//               <InputLabel>Tax Type</InputLabel>
//               <Select
//               className="custom-bordered-input"
//                 value={taxType}
//                 label="Tax Type"
//                 onChange={(e) => setTaxType(e.target.value)}
//               >
//                 <MenuItem value="All">All</MenuItem>
//                 <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
//                 <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
//                 <MenuItem value="GST (URD)">GST (URD)</MenuItem>
//                 <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
//                 <MenuItem value="Tax Free Within State">
//                   Tax Free Within State
//                 </MenuItem>
//                 <MenuItem value="Tax Free Interstate">
//                   Tax Free Interstate
//                 </MenuItem>
//                 <MenuItem value="Export Sale">Export Sale</MenuItem>
//                 <MenuItem value="Export Sale(IGST)">Export Sale(IGST)</MenuItem>
//                 <MenuItem value="Including GST">Including GST</MenuItem>
//                 <MenuItem value="Including IGST">Including IGST</MenuItem>
//                 <MenuItem value="Not Applicable">Not Applicable</MenuItem>
//                 <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
//               </Select>
//             </FormControl>
//           </div>

//         </div>

//         <div className={styles.tables} style={{ padding: 0 }}>
//           <Table className="custom-table" size="sm">
//             <thead style={{ backgroundColor: "#83bcf5ff" }}>
//               <tr>
//                 <th className="text-center">Account Name</th>
//                 <th className="text-center">Case/Pcs</th>
//                 <th className="text-center">Qty</th>
//                 <th className="text-center">Value</th>
//                 <th className="text-center">C.GST</th>
//                 <th className="text-center">S.GST</th>
//                 <th className="text-center">I.GST</th>
//                 <th className="text-center">Cess</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((r, i) => (
//                 <tr key={i} className={i === activeRow ? styles.activeRow : ""}>
//                   <td>{r.account}</td>
//                   <td className="text-end">{r.pcs ? r.pcs.toFixed(3) : ""}</td>
//                   <td className="text-end">{r.qty ? r.qty.toFixed(3) : ""}</td>
//                   <td className="text-end">
//                     {r.value ? r.value.toFixed(2) : ""}
//                   </td>
//                   <td className="text-end">
//                     {r.cgst ? r.cgst.toFixed(2) : ""}
//                   </td>
//                   <td className="text-end">
//                     {r.sgst ? r.sgst.toFixed(2) : ""}
//                   </td>
//                   <td className="text-end">
//                     {r.igst ? r.igst.toFixed(2) : ""}
//                   </td>
//                   <td></td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//         <Card.Footer className="fw-bold" style={{ fontSize: "20px" }}>
//           Total Sale Rs. {totalSale.toFixed(2)}
//           <Button
//             style={{ letterSpacing: 2, marginLeft: 20 }}
//             onClick={() => setShowPrint(true)}
//           >
//             PRINT
//           </Button>
//         </Card.Footer>
//       </Card>
//       <PrintSummary
//         isOpen={showPrint}
//         handleClose={() => setShowPrint(false)}
//         rows={rows}
//         totalSale={totalSale}
//         fromDate={formatDate(fromDate)}
//         toDate={toDate}
//         header={"Sale TaxWise Summary"}
//         Total={"Total Sale Rs"}
//       />
//       <AccountEntriesModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         accountName={selectedAccount}
//         entries={getAccountEntries()}
//         fromDate={fromDate}
//         uptoDate={toDate}
//       />
//     </div>
//   );
// };

// export default TaxWiseSale;
