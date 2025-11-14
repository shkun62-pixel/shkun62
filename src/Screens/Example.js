// import React, { useEffect, useState,useRef } from "react";
// import { Table, Button } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";
// import { useNavigate } from "react-router-dom";
// import ReceiptModal from "./Modals/ReceiptModal";

// const LOCAL_STORAGE_KEY = "PayementListTableData";

// const Example = () => {
  
//   const navigate = useNavigate();
//   const {dateFrom} = useCompanySetup();

//   const defaultTableFields = {
//     date: true,
//     billno: true,
//     weight: true, 
//     pcs: false, 
//     accountname: true,
//     city: true,
//     gstin: true,
//     value: true,
//     cgst: true,
//     sgst: true,
//     igst: true,
//     netvalue: true,
//     exp1: false,
//     exp2: false,
//     exp3: false,
//     exp4: false,
//     exp5: false,
//     exp6: false,
//     exp7: false,
//     exp8: false,
//     exp9: false,
//     exp10: false,          
//     description: false,  
//     vehicleno: false,    
//     remarks: false,     
//     transport: false, 
//     broker: false,    
//     taxtype: false,                               
//   };
  
//   const [tableData, settableData] = useState(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     const parsed = saved ? JSON.parse(saved) : {};
//     // Only keep keys that exist in defaultFormData
//     const sanitized = Object.fromEntries(
//       Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
//         Object.hasOwn(defaultTableFields, key)
//       )
//     );
    
//     return sanitized;
//   });

//   const defaultColumnOrder = {
//     date: 1,
//     billno: 2,
//     weight: 3,
//     pcs: 4,
//     accountname: 5,
//     city: 6,
//     gstin:7,
//     value: 8,
//     cgst: 9,
//     sgst: 10,
//     igst: 11,
//     netvalue: 12,
//     exp1: 13,
//     exp2: 14,
//     exp3: 15,
//     exp4: 16,
//     exp5: 17,
//     exp6: 18,
//     exp7: 19,
//     exp8: 20,
//     exp9: 21,
//     exp10: 22,
//     description: 23,
//     vehicleno: 24,
//     remarks: 25,
//     transport: 26,
//     broker:27,
//     taxtype: 28,
//   };

//     const [columnOrder, setColumnOrder] = useState(() => {
//       const saved = localStorage.getItem("ColumnOrderPList");
//       console.log("saved:",saved);
      
//       const parsed = saved ? JSON.parse(saved) : {};
//       return { ...defaultColumnOrder, ...parsed }; // ✅ merge saved over defaults
//     });

//     // Increase Decrease fontSize
//     const [fontSize, setFontSize] = useState(() => {
//       const saved = localStorage.getItem("FontSizePList");
//       return saved ? parseInt(saved, 10) : 15;
//     });

//   // Payement Modal State
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [activeRowIndex, setActiveRowIndex] = useState(0);
//   const tableRef = useRef(null);
//   const [entries, setEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(() => new Date());
//   const [selectedSupplier, setSelectedSupplier] = useState(""); 
//   const [selectedItems, setSelectedItems] = useState(""); 
//   const rowRefs = useRef([]);

//   useEffect(() => {
//     if (!fromDate && dateFrom) {
//       setFromDate(new Date(dateFrom));
//     }
//   }, [dateFrom, fromDate]);

  
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (tableRef.current) {
//         tableRef.current.focus();
//       }
//     }, 0);

//     return () => clearTimeout(timer);
//   }, []);

//  useEffect(() => {
//    if (!fromDate || !toDate) return;
 
//    const fetchEntries = async () => {
//      setLoading(true);
//      try {
//        // 1️⃣ Fetch Sale Entries
//        const saleRes = await fetch(
//          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale`
//        );
//        if (!saleRes.ok) throw new Error("Failed to fetch sale data");
//        const saleData = await saleRes.json();
 
//        // Filter sales by date
//        const filteredByDate = saleData.filter((entry) => {
//          const entryDate = new Date(entry.formData?.date);
//          return entryDate >= fromDate && entryDate <= toDate;
//        });
 
//        // 2️⃣ Fetch Bank Voucher Entries
//        const bankRes = await fetch(
//          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/bank`
//        );
//        if (!bankRes.ok) throw new Error("Failed to fetch bank data");
//        const bankData = await bankRes.json();
 
//        // Flatten bank voucher items
//        const bankItems = bankData.flatMap((voucher) => voucher.items || []);
 
//        // 3️⃣ Filter out sales already received in bank
//        const unpaidSales = filteredByDate.filter((sale) => {
//          const accountName =
//            sale.customerDetails?.[0]?.vacode?.trim().toLowerCase() || "";
//          const saleAmount = parseFloat(sale.formData?.grandtotal || 0);
 
//          const isReceived = bankItems.some((item) => {
//            const bankName = item.accountname?.trim().toLowerCase() || "";
//            const bankAmount = parseFloat(item.receipt_credit || 0);
//            const amountMatch = Math.abs(bankAmount - saleAmount) < 1; // ₹1 tolerance
 
//            return bankName === accountName && amountMatch;
//          });
 
//          return !isReceived; // keep only unpaid
//        });
 
//        // 4️⃣ Update state
//        setEntries(unpaidSales);
//        setFilteredEntries(unpaidSales);
//      } catch (err) {
//        setError(err.message);
//      } finally {
//        setLoading(false);
//      }
//    };
 
//    fetchEntries();
//  }, [fromDate, toDate]);

//   const uniqueItem = [...new Set(entries.map(entry => entry.items?.[0]?.sdisc))].filter(Boolean);
//   const uniqueSuppliers = [...new Set(entries.map(entry => entry.customerDetails?.[0]?.vacode))].filter(Boolean);

//   // Calculate totals based on filtered data
//   const totalGrandTotal = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.grandtotal || 0), 0);
//   const totalCGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.cgst || 0), 0);
//   const totalSGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.sgst || 0), 0);
//   const totalIGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.igst || 0), 0);
//   const totalTAX = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.sub_total || 0), 0);
//   const totalWeight = filteredEntries.reduce((entryAcc, entry) => {
//     const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.weight || 0), 0);
//     return entryAcc + itemTotal;
//   }, 0);
//   const totalPcs = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.pkgs || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);

//   const totalexp1 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp1 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp2 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp2 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp3 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp3 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp4 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp4 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp5 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp5 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);

//   const totalexp6 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp6 || 0), 0);
//   const totalexp7 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp7 || 0), 0);
//   const totalexp8 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp8 || 0), 0);
//   const totalexp9 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp9 || 0), 0);
//   const totalexp10 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp10 || 0), 0);


//   const formatDate = (dateValue) => {
//     // Check if date is already in dd/mm/yyyy or d/m/yyyy format
//     const ddmmyyyyPattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

//     if (ddmmyyyyPattern.test(dateValue)) {
//       return dateValue;  // already correctly formatted
//     }

//     const dateObj = new Date(dateValue);
//     if (isNaN(dateObj)) {
//       return "";  // invalid date fallback
//     }
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const year = dateObj.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Show loading only after user selects the dates
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   // Sorting Column Order
//   const sortedVisibleFields = Object.keys(tableData)
//   .filter(field => tableData[field]) // only visible ones
//   .sort((a, b) => {
//     const orderA = parseInt(columnOrder[a]) || 999;
//     const orderB = parseInt(columnOrder[b]) || 999;
//     return orderA - orderB;
//   });

//   return (
//     <div>
//       <h3 className="bank-title">📒 Receipt LIST</h3>

//       <div style={{ display: "flex",flexDirection:"row", marginBottom: 10,marginLeft:10, marginTop:"20px" }}>
//       <div>
//         <span className="text-lg mr-2">Period From:</span>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => setFromDate(date)}
//             dateFormat="dd/MM/yyyy"
//             className="datepickerBank"
//             placeholderText="From Date"
//           />
//         </div>
//         <div>
//         <span className="text-lg ml-3 mr-2">UpTo:</span>
//         <DatePicker
//           selected={toDate}
//           onChange={(date) => setToDate(date)}
//           dateFormat="dd/MM/yyyy"
//           className="datepickerBank2"
//           placeholderText="To Date"
//         />
//         </div>
//       </div>
//         <div
//                ref={tableRef}
//                tabIndex={0}
//                style={{ maxHeight: 530, overflowY: "auto", padding: 5, outline: "none" }}
//              >
//              <Table className="custom-table" bordered>
//              <thead style={{ backgroundColor: "skyblue", position: "sticky", top: -6, textAlign: 'center',    fontSize: `${fontSize}px` }}>
//                <tr>
//                  {sortedVisibleFields.map((field) => (
//                    <th key={field}>
//                      {field === "date" ? "Date" :
//                      field === "billno" ? "BillNo." :
//                      field === "accountname" ? "A/C Name" :
//                      field === "weight" ? "Qty" :
//                      field === "pcs" ? "Pcs" :
//                      field === "city" ? "City" :
//                      field === "gstin" ? "Gstin" :
//                      field === "value" ? "Bill Value" :
//                      field === "cgst" ? "C.Tax" :
//                      field === "sgst" ? "S.Tax" :
//                      field === "igst" ? "I.Tax" :
//                      field === "netvalue" ? "Net value" :
//                      field === "exp1" ? "Exp1" :
//                      field === "exp2" ? "Exp2" :
//                      field === "exp3" ? "Exp3" :
//                      field === "exp4" ? "Exp4" :
//                      field === "exp5" ? "Exp5" :
//                      field === "exp6" ? "Exp6" :
//                      field === "exp7" ? "Exp7" :
//                      field === "exp8" ? "Exp8" :
//                      field === "exp9" ? "Exp9" :
//                      field === "exp10" ? "Exp10" : 
//                      field === "description" ? "Description" : 
//                      field === "vehicleno" ? "Vehicleno" :    
//                      field === "remarks" ? "Remarks" :      
//                      field === "transport" ? "Transport" :     
//                      field === "broker" ? "Broker" :
//                      field === "taxtype" ? "TaxType" :
//                      field.toUpperCase()}
//                    </th>
//                  ))}
//                  <th>Action</th>
//                </tr>
//              </thead>
//              <tbody>
//                {filteredEntries.map((entry, index) => {
//                  const formData = entry.formData || {};
//                  const customerDetails = entry.customerDetails?.[0] || {};
//                  const item = entry.items?.[0] || {};
//                  const totalItemWeight = entry.items?.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(3);
//                  const totalItemPkgs = entry.items?.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(3);
//                  const isActive = index === activeRowIndex;
     
//                  return (
//                   <tr
//                      key={index}
//                      ref={(el) => (rowRefs.current[index] = el)}
//                      tabIndex={0} // ✅ focusable row
//                      onMouseEnter={() => setActiveRowIndex(index)}
//                      onClick={() => {
//                        navigate("/sale", { state: { saleId: entry._id, rowIndex: index } }); // ✅ pass via state
//                         localStorage.setItem("selectedRowIndex", activeRowIndex); 
//                      }}
//                      style={{
//                        backgroundColor: isActive ? "rgb(197, 190, 190)" : "",
//                        cursor: "pointer",
//                        fontSize: `${fontSize}px`,
//                      }}
//                      >
//                      {sortedVisibleFields.map((field) => {
//                        let value = "";
//                        if (field === "date") value = formatDate(formData.date);
//                        else if (field === "billno") value = formData.vno || "";
//                        else if (field === "accountname") value = customerDetails.vacode || "";
//                        else if (field === "weight") value = totalItemWeight;
//                        else if (field === "pcs") value = totalItemPkgs;
//                        else if (field === "city") value = customerDetails.city || "";
//                        else if (field === "gstin") value = customerDetails.gstno || "";
//                        else if (field === "value") value = formData.grandtotal || "";
//                        else if (field === "cgst") value = formData.cgst || "";
//                        else if (field === "sgst") value = formData.sgst || "";
//                        else if (field === "igst") value = formData.igst || "";
//                        else if (field === "netvalue") value = formData.sub_total || "";
//                        else if (field === "exp1") value = item.Exp1 || "0.00";
//                        else if (field === "exp2") value = item.Exp2 || "0.00";
//                        else if (field === "exp3") value = item.Exp3 || "0.00";
//                        else if (field === "exp4") value = item.Exp4 || "0.00";
//                        else if (field === "exp5") value = item.Exp5 || "0.00";
//                        else if (field === "exp6") value = formData.Exp6 || "";
//                        else if (field === "exp7") value = formData.Exp7 || "";
//                        else if (field === "exp8") value = formData.Exp8 || "";
//                        else if (field === "exp9") value = formData.Exp9 || "";
//                        else if (field === "exp10") value = formData.Exp10 || ""; 
//                        else if (field === "description") value = item.sdisc || "";
//                        else if (field === "vehicleno") value = formData.trpt || "";
//                        else if (field === "remarks") value = formData.rem2 || "";
//                        else if (field === "transport") value = formData.v_tpt || "";
//                        else if (field === "broker") value = formData.broker || "" ;
//                        else if (field === "taxtype") value = formData.stype || "" ;
//                        return <td key={field}>{value}</td>;
//                      })}
//                      <td style={{ textAlign: "center" }}>
//                       <Button
//                        variant="success"
//                        size="sm"
//                        onClick={(e) => {
//                          e.stopPropagation();
//                          setSelectedEntry(entry);
//                          setShowPaymentModal(true);
//                        }}
//                      >
//                        Make Payment
//                      </Button>
//                      </td>
//                    </tr>
//                  );
//                })}
//              </tbody>
//            <tfoot style={{ backgroundColor: "skyblue", position: "sticky", bottom: -6, fontSize: `${fontSize}px` }}>
//                <tr>
//                  {sortedVisibleFields.map((field, idx) => {
//                    let value = "";
//                    if (field === "date") value = "TOTAL";
//                    else if (field === "value") value = totalGrandTotal.toFixed(2);
//                    else if (field === "cgst") value = totalCGST.toFixed(2);
//                    else if (field === "sgst") value = totalSGST.toFixed(2);
//                    else if (field === "igst") value = totalIGST.toFixed(2);
//                    else if (field === "netvalue") value = totalTAX.toFixed(2);
//                    else if (field === "weight") value = totalWeight.toFixed(3);
//                    else if (field === "pcs") value = totalPcs.toFixed(3);
//                    else if (field === "exp1") value = totalexp1.toFixed(2);
//                    else if (field === "exp2") value = totalexp2.toFixed(2);
//                    else if (field === "exp3") value = totalexp3.toFixed(2);
//                    else if (field === "exp4") value = totalexp4.toFixed(2);
//                    else if (field === "exp5") value = totalexp5.toFixed(2);
//                    else if (field === "exp6") value = totalexp6.toFixed(2);
//                    else if (field === "exp7") value = totalexp7.toFixed(2);
//                    else if (field === "exp8") value = totalexp8.toFixed(2);
//                    else if (field === "exp9") value = totalexp9.toFixed(2);
//                    else if (field === "exp10") value = totalexp10.toFixed(2);
//                    return <td key={field} style={{ fontWeight: value ? "bold" : "", color: value ? "red" : "" }}>{value}</td>;
//                  })}
//                   <td></td>
//                </tr>
//              </tfoot>
//              </Table>
//         </div>
//           <ReceiptModal
//            show={showPaymentModal}
//            onHide={() => setShowPaymentModal(false)}
//            entry={selectedEntry}
//          />
//     </div>
//   );
// };

// export default Example;



// import React, { useEffect, useState, useRef } from "react";
// import { Table, Button } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";
// import { useNavigate } from "react-router-dom";
// import ReceiptModal from "./Modals/ReceiptModal";

// const LOCAL_STORAGE_KEY = "PayementListTableData";

// const Example = () => {
//   const navigate = useNavigate();
//   const { dateFrom } = useCompanySetup();

//   const defaultTableFields = {
//     date: true,
//     billno: true,
//     accountname: true,
//     city: true,
//     gstin: true,
//     value: true,
//     paidamount: true,
//     balance: true,
//   };

//   const [tableData, settableData] = useState(defaultTableFields);
//   const [entries, setEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(() => new Date());
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);

//   const tableRef = useRef(null);
//   const [activeRowIndex, setActiveRowIndex] = useState(0);
//   const rowRefs = useRef([]);

//   // ✅ Helper to safely format amounts
//   const formatAmount = (val) => {
//     const num = parseFloat(val);
//     return isNaN(num) ? "0.00" : num.toFixed(2);
//   };

//   // ✅ Format date safely
//   const formatDate = (dateValue) => {
//     if (!dateValue) return "";
//     const d = new Date(dateValue);
//     if (isNaN(d)) return "";
//     return `${String(d.getDate()).padStart(2, "0")}/${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}/${d.getFullYear()}`;
//   };

//   // Load company start date
//   useEffect(() => {
//     if (!fromDate && dateFrom) setFromDate(new Date(dateFrom));
//   }, [dateFrom, fromDate]);

//   // Fetch data when date range changes
//   useEffect(() => {
//     if (!fromDate || !toDate) return;

//     const fetchEntries = async () => {
//       setLoading(true);
//       try {
//         // 1️⃣ Fetch sales
//         const saleRes = await fetch(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale`
//         );
//         if (!saleRes.ok) throw new Error("Failed to fetch sale data");
//         const saleData = await saleRes.json();

//         const filteredSales = (Array.isArray(saleData) ? saleData : []).filter(
//           (entry) => {
//             const entryDate = new Date(entry?.formData?.date || "");
//             return entryDate >= fromDate && entryDate <= toDate;
//           }
//         );

//         // 2️⃣ Fetch bank vouchers
//         const bankRes = await fetch(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/bank`
//         );
//         if (!bankRes.ok) throw new Error("Failed to fetch bank data");
//         const bankRaw = await bankRes.json();

//         const bankData = Array.isArray(bankRaw)
//           ? bankRaw.map((b) => b?.data || b)
//           : [];

//         // 3️⃣ Create payment map
//         const paymentMap = new Map();
//         bankData.forEach((voucher) => {
//           const vForm = voucher?.formData || {};
//           const items = Array.isArray(voucher?.items)
//             ? voucher.items
//             : Array.isArray(voucher?.data?.items)
//             ? voucher.data.items
//             : [];

//           const billNo = parseInt(vForm.againstbillno || 0);
//           if (!billNo) return;

//           const totalPaid = items.reduce(
//             (sum, item) => sum + parseFloat(item?.receipt_credit || 0),
//             0
//           );
//           paymentMap.set(billNo, (paymentMap.get(billNo) || 0) + totalPaid);
//         });

//         // 4️⃣ Merge payment info
//         const updatedSales = filteredSales
//           .map((sale) => {
//             const formData = sale?.formData || {};
//             const saleBillNo = parseInt(formData?.vno || 0);
//             const saleAmount = parseFloat(formData?.grandtotal || 0);
//             const paidAmount = paymentMap.get(saleBillNo) || 0;
//             const balance = saleAmount - paidAmount;

//             return {
//               ...sale,
//               formData: {
//                 ...formData,
//                 paidAmount,
//                 balance,
//               },
//             };
//           })
//           .filter((sale) => sale?.formData?.balance > 0.5);

//         setEntries(updatedSales);
//         setFilteredEntries(updatedSales);
//       } catch (err) {
//         console.error("❌ Fetch Error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEntries();
//   }, [fromDate, toDate]);

//   // Totals
//   const totalGrandTotal = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.grandtotal || 0),
//     0
//   );
//   const totalPaid = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.paidAmount || 0),
//     0
//   );
//   const totalBalance = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.balance || 0),
//     0
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   const sortedFields = Object.keys(tableData);

//   return (
//     <div>
//       <h3 className="bank-title">📒 Receipt LIST</h3>

//       {/* Date Filters */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           marginBottom: 10,
//           marginLeft: 10,
//           marginTop: "20px",
//         }}
//       >
//         <div>
//           <span className="text-lg mr-2">Period From:</span>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => setFromDate(date)}
//             dateFormat="dd/MM/yyyy"
//             className="datepickerBank"
//           />
//         </div>
//         <div>
//           <span className="text-lg ml-3 mr-2">UpTo:</span>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd/MM/yyyy"
//             className="datepickerBank2"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div
//         ref={tableRef}
//         tabIndex={0}
//         style={{
//           maxHeight: 530,
//           overflowY: "auto",
//           padding: 5,
//           outline: "none",
//         }}
//       >
//         <Table className="custom-table" bordered>
//           <thead
//             style={{
//               backgroundColor: "skyblue",
//               position: "sticky",
//               top: -6,
//               textAlign: "center",
//               fontSize: "15px",
//             }}
//           >
//             <tr>
//               {sortedFields.map((field) => (
//                 <th key={field}>
//                   {field === "paidamount"
//                     ? "Paid"
//                     : field === "balance"
//                     ? "Balance"
//                     : field === "value"
//                     ? "Bill Value"
//                     : field.toUpperCase()}
//                 </th>
//               ))}
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredEntries.map((entry, index) => {
//               const formData = entry?.formData || {};
//               const customer = entry?.customerDetails?.[0] || {};

//               return (
//                 <tr
//                   key={index}
//                   ref={(el) => (rowRefs.current[index] = el)}
//                   onMouseEnter={() => setActiveRowIndex(index)}
//                   style={{
//                     backgroundColor:
//                       index === activeRowIndex ? "rgb(197,190,190)" : "",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <td>{formatDate(formData?.date)}</td>
//                   <td>{formData?.vno || ""}</td>
//                   <td>{customer?.vacode || ""}</td>
//                   <td>{customer?.city || ""}</td>
//                   <td>{customer?.gstno || ""}</td>
//                   <td>{formatAmount(formData?.grandtotal)}</td>
//                   <td>{formatAmount(formData?.paidAmount)}</td>
//                   <td>{formatAmount(formData?.balance)}</td>
//                   <td style={{ textAlign: "center" }}>
//                     <Button
//                       variant="success"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedEntry(entry);
//                         setShowPaymentModal(true);
//                       }}
//                     >
//                       Make Payment
//                     </Button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>

//           <tfoot
//             style={{
//               backgroundColor: "skyblue",
//               position: "sticky",
//               bottom: -6,
//               fontSize: "15px",
//             }}
//           >
//             <tr>
//               <td colSpan={5} style={{ fontWeight: "bold" }}>
//                 TOTAL
//               </td>
//               <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalGrandTotal)}
//               </td>
//               <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalPaid)}
//               </td>
//               <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalBalance)}
//               </td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </Table>
//       </div>

//       <ReceiptModal
//         show={showPaymentModal}
//         onHide={() => setShowPaymentModal(false)}
//         entry={selectedEntry}
//       />
//     </div>
//   );
// };

// export default Example;


// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { Table, Button } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";
// import { useNavigate } from "react-router-dom";
// import ReceiptModal from "./Modals/ReceiptModal";

// const LOCAL_STORAGE_KEY = "PayementListTableData";

// const Example = () => {
//   const navigate = useNavigate();
//   const { dateFrom } = useCompanySetup();

//   const defaultTableFields = {
//     date: true,
//     billno: true,
//     accountname: true,
//     city: true,
//     gstin: true,
//     value: true,
//     paidamount: true,
//     balance: true,
//   };

//   const [tableData, settableData] = useState(defaultTableFields);
//   const [entries, setEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(() => new Date());
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);

//   const tableRef = useRef(null);
//   const [activeRowIndex, setActiveRowIndex] = useState(0);
//   const rowRefs = useRef([]);

//   const formatAmount = (val) => {
//     const num = parseFloat(val);
//     return isNaN(num) ? "0.00" : num.toFixed(2);
//   };

//   const formatDate = (dateValue) => {
//     if (!dateValue) return "";
//     const d = new Date(dateValue);
//     if (isNaN(d)) return "";
//     return `${String(d.getDate()).padStart(2, "0")}/${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}/${d.getFullYear()}`;
//   };

//   useEffect(() => {
//     if (!fromDate && dateFrom) setFromDate(new Date(dateFrom));
//   }, [dateFrom, fromDate]);

//   // ✅ Fetch entries (reusable function)
//   const fetchEntries = useCallback(async () => {
//     if (!fromDate || !toDate) return;

//     setLoading(true);
//     try {
//       // --- 1️⃣ Fetch sales ---
//       const saleRes = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale`
//       );
//       if (!saleRes.ok) throw new Error("Failed to fetch sale data");
//       const saleData = await saleRes.json();

//       const filteredSales = (Array.isArray(saleData) ? saleData : []).filter(
//         (entry) => {
//           const entryDate = new Date(entry?.formData?.date || "");
//           return entryDate >= fromDate && entryDate <= toDate;
//         }
//       );

//       // --- 2️⃣ Fetch bank vouchers ---
//       const bankRes = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/bank`
//       );
//       if (!bankRes.ok) throw new Error("Failed to fetch bank data");
//       const bankRaw = await bankRes.json();

//       const bankData = Array.isArray(bankRaw)
//         ? bankRaw.map((b) => b?.data || b)
//         : [];

//       // --- 3️⃣ Create payment map ---
//       const paymentMap = new Map();
//       bankData.forEach((voucher) => {
//         const vForm = voucher?.formData || {};
//         const items = Array.isArray(voucher?.items)
//           ? voucher.items
//           : Array.isArray(voucher?.data?.items)
//           ? voucher.data.items
//           : [];

//         const billNo = parseInt(vForm.againstbillno || 0);
//         if (!billNo) return;

//         const totalPaid = items.reduce(
//           (sum, item) => sum + parseFloat(item?.receipt_credit || 0),
//           0
//         );
//         paymentMap.set(billNo, (paymentMap.get(billNo) || 0) + totalPaid);
//       });

//       // --- 4️⃣ Merge payment info ---
//       const updatedSales = filteredSales
//         .map((sale) => {
//           const formData = sale?.formData || {};
//           const saleBillNo = parseInt(formData?.vno || 0);
//           const saleAmount = parseFloat(formData?.grandtotal || 0);
//           const paidAmount = paymentMap.get(saleBillNo) || 0;
//           const balance = saleAmount - paidAmount;

//           return {
//             ...sale,
//             formData: {
//               ...formData,
//               paidAmount,
//               balance,
//             },
//           };
//         })
//         // ✅ Hide fully paid bills
//         .filter((sale) => sale?.formData?.balance > 0.5);

//       setEntries(updatedSales);
//       setFilteredEntries(updatedSales);
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [fromDate, toDate]);

//   // Fetch initially and when dates change
//   useEffect(() => {
//     fetchEntries();
//   }, [fetchEntries]);

//   // Totals
//   const totalGrandTotal = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.grandtotal || 0),
//     0
//   );
//   const totalPaid = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.paidAmount || 0),
//     0
//   );
//   const totalBalance = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.balance || 0),
//     0
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   const sortedFields = Object.keys(tableData);

//   return (
//     <div>
//       <h3 className="bank-title">📒 Receipt LIST</h3>

//       {/* Date Filters */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           marginBottom: 10,
//           marginLeft: 10,
//           marginTop: "20px",
//         }}
//       >
//         <div>
//           <span className="text-lg mr-2">Period From:</span>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => setFromDate(date)}
//             dateFormat="dd/MM/yyyy"
//             className="datepickerBank"
//           />
//         </div>
//         <div>
//           <span className="text-lg ml-3 mr-2">UpTo:</span>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd/MM/yyyy"
//             className="datepickerBank2"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div
//         ref={tableRef}
//         tabIndex={0}
//         style={{
//           maxHeight: 530,
//           overflowY: "auto",
//           padding: 5,
//           outline: "none",
//         }}
//       >
//         <Table className="custom-table" bordered>
//           <thead
//             style={{
//               backgroundColor: "skyblue",
//               position: "sticky",
//               top: -6,
//               textAlign: "center",
//               fontSize: "15px",
//             }}
//           >
//             <tr>
//               {sortedFields.map((field) => (
//                 <th key={field}>
//                   {field === "paidamount"
//                     ? "Paid"
//                     : field === "balance"
//                     ? "Balance"
//                     : field === "value"
//                     ? "Bill Value"
//                     : field.toUpperCase()}
//                 </th>
//               ))}
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredEntries.map((entry, index) => {
//               const formData = entry?.formData || {};
//               const customer = entry?.customerDetails?.[0] || {};

//               return (
//                 <tr
//                   key={index}
//                   ref={(el) => (rowRefs.current[index] = el)}
//                   onMouseEnter={() => setActiveRowIndex(index)}
//                   style={{
//                     backgroundColor:
//                       index === activeRowIndex ? "rgb(197,190,190)" : "",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <td>{formatDate(formData?.date)}</td>
//                   <td>{formData?.vno || ""}</td>
//                   <td>{customer?.vacode || ""}</td>
//                   <td>{customer?.city || ""}</td>
//                   <td>{customer?.gstno || ""}</td>
//                   <td>{formatAmount(formData?.grandtotal)}</td>
//                   <td>{formatAmount(formData?.paidAmount)}</td>
//                   <td>{formatAmount(formData?.balance)}</td>
//                   <td style={{ textAlign: "center" }}>
//                     <Button
//                       variant="success"
//                       size="sm"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedEntry(entry);
//                         setShowPaymentModal(true);
//                       }}
//                     >
//                       Make Payment
//                     </Button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>

//           <tfoot
//             style={{
//               backgroundColor: "skyblue",
//               position: "sticky",
//               bottom: -6,
//               fontSize: "15px",
//             }}
//           >
//             <tr>
//               <td colSpan={5} style={{ fontWeight: "bold" }}>
//                 TOTAL
//               </td>
//               <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalGrandTotal)}
//               </td>
//               <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalPaid)}
//               </td>
//               <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalBalance)}
//               </td>
//               <td></td>
//             </tr>
//           </tfoot>
//         </Table>
//       </div>

//       {/* ✅ Pass refresh callback to modal */}
//       <ReceiptModal
//         show={showPaymentModal}
//         onHide={() => setShowPaymentModal(false)}
//         entry={selectedEntry}
//         onPaymentSaved={fetchEntries}
//       />
//     </div>
//   );
// };

// export default Example;


import React,{useState} from 'react'
import Table from "react-bootstrap/Table";
import ProductModalCustomer from './Modals/ProductModalCustomer';

const Example = () => {

  const tenant = "shkun_05062025_05062026"
  const [formData, setFormData] = useState({
  narr:""
  });
  const [items, setItems] = useState([
    {
      id: 1,
      acode:"",
      accountname: "",
      narration: "",
      payment_debit: "",
      receipt_credit: "",
      discount: "",
      discounted_payment: "",
      discounted_receipt: "",
      disablePayment: false,
      disableReceipt: false,
    },
  ]);

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const [narrationSuggestions, setNarrationSuggestions] = useState([]);

const fetchNarrations = async () => {
  try {
    const res = await fetch(
      "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/cash"
    );
    const data = await res.json();

    // extract narrations from all items
    const narrs = data
      .flatMap(entry => entry.items || [])
      .map(item => item.narration)
      .filter(n => n && n.trim() !== "");  // remove empty narrations

    // unique values
    const uniqueNarrs = [...new Set(narrs)];

    setNarrationSuggestions(uniqueNarrs);
  } catch (err) {
    console.error("Narration fetch failed:", err);
  }
};

  // Modal For Customer
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  
  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
    fetchNarrations();  // new
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProductsCus(formattedData);
      setLoadingCus(false);
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
    }
  };

  const handleItemChangeCus = (index, key, value) => {
    if ((key === "discount") && !/^\d*\.?\d*$/.test(value)) {
      return; // reject invalid input
    }
    const updatedItems = [...items];
    updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["accountname"] = selectedProduct.ahead;
      }
    } else if (key === "discount" || key === "payment_debit" ||key === "receipt_credit") {
      const payment = parseFloat(updatedItems[index]["payment_debit"]) || 0;
      const discount = parseFloat(updatedItems[index]["discount"]) || 0;
      const discountedPayment = payment - discount;
      const receipt = parseFloat(updatedItems[index]["receipt_credit"]) || 0;

      let discountedReceipt = receipt - discount;
      if (updatedItems[index].disableReceipt) {
        discountedReceipt = 0; // Set to zero if receipt field is disabled
      }

      let discounted_payment = discountedPayment;
      if (updatedItems[index].disablePayment) {
        discounted_payment = 0; // Set to zero if payment field is disabled
      }

      updatedItems[index]["payment_debit"] = payment.toFixed(2);
      updatedItems[index]["discounted_payment"] = discounted_payment.toFixed(2);
      updatedItems[index]["receipt_credit"] = receipt.toFixed(2);
      updatedItems[index]["discounted_receipt"] = discountedReceipt.toFixed(2);
      updatedItems[index]["discount"] = discount;
    }
    setItems(updatedItems);
  };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...items];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      accountname: product.ahead || '', 
      acode: product.acode || '', 
    };
    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
      setShowModalCus(false);
    }
    setItems(newCustomers);
    setShowModalCus(false);
  
  };

  const handleCloseModalCus = () => {
    setShowModalCus(false);
    setPressedKey(""); // resets for next modal open
  };

  const openModalForItemCus = (index) => {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
  };

  const allFieldsCus = productsCus.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

    const handleNumberChange = (event, index, field) => {
    const value = event.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    const isValueGreaterThanZero = parseFloat(value) > 0;

    if (field === "payment_debit") {
      updatedItems[index].disableReceipt = isValueGreaterThanZero;
    } else if (field === "receipt_credit") {
      updatedItems[index].disablePayment = isValueGreaterThanZero;
    }
    setItems(updatedItems);
  };
  

  return (
    <div>
       {showModalCus && (
        <ProductModalCustomer
          allFields={allFieldsCus}
          onSelect={handleProductSelectCus}
          onClose={handleCloseModalCus}
          initialKey={pressedKey}
          tenant={tenant}
        />
        )}
      <div className="TableSectionz">
        <Table className="custom-table">
          <thead
            style={{
              backgroundColor: "skyblue",
              textAlign: "center",
              position: "sticky",
              top: 0,
            }}
          >
            <tr style={{ color: "white" }}>
              <th>ACCOUNTNAME</th>
              <th>NARRATION</th>
              <th>PAYMENT</th>
              <th>RECEIPT</th>
              <th>DISCOUNT</th>
              <th className="text-center">DELETE</th>
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto", maxHeight: "calc(520px - 40px)" }}>
            {items.map((item, index) => (
              <tr key={`${item.accountname}-${index}`}>
                <td style={{ padding: 0 }}>
                  <input
                  className="Account"
                    style={{
                      height: 40,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    type="text"
                    value={item.accountname}
                  />
                </td>
                <td style={{ padding: 0 }}>
                 <input
  className="Narration"
  list="narrationList"
  style={{
    height: 40,
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    padding: 5,
  }}
  value={item.narration}
  onChange={(e) =>
    handleItemChangeCus(index, "narration", e.target.value)
  }
/>

<datalist id="narrationList">
  {narrationSuggestions.map((n, i) => (
    <option key={i} value={n} />
  ))}
</datalist>

                </td>
                <td style={{ padding: 0, width: 160 }}>
                  <input
                  className="Payment"
                    style={{
                      height: 40,
                      textAlign: "right",
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.payment_debit}
                    onChange={(e) =>
                      handleNumberChange(e, index, "payment_debit")
                    }
                  />
                </td>
                <td style={{ padding: 0, width: 160 }}>
                  <input
                  className="Receipt"
                    style={{
                      height: 40,
                      textAlign: "right",
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.receipt_credit}
                    onChange={(e) =>
                      handleNumberChange(e, index, "receipt_credit")
                    }
                  />
                </td>
                <td style={{ padding: 0, width: 160 }}>
                  <input
                  className="Discounts"
                    style={{
                      height: 40,
                      textAlign: "right",
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                    }}
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChangeCus(index, "discount", e.target.value)
                    }
                  />
                </td>
                <td style={{ padding: 0}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center", // horizontally center
                      alignItems: "center",      // vertically center
                      height: "100%",            // takes full cell height
                    }}
                  >
                    delete
                  </div>
                </td>
           
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Example
