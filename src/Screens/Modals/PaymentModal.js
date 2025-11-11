// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
// import axios from "axios";
// import { toast } from "react-toastify";

// const PaymentModal = ({ show, onHide, entry, onPaymentSaved }) => {
//   const [amount, setAmount] = useState("");
//   const [discount, setDiscount] = useState("0.00");
//   const [mode, setMode] = useState("Cash");
//   const [remarks, setRemarks] = useState("");
//   const [voucherno, setVoucherno] = useState(null);
//   const [bankName, setBankName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);

//   const supplier = entry?.customerDetails?.[0] || {};
//   const formData = entry?.formData || {};

//   // ✅ Fetch last voucher number and bank name from /bank/last
//   const fetchLastVoucherAndBank = async () => {
//     try {
//       setInitialLoading(true);
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last"
//       );

//       const last = res.data?.data;
//       const lastVoucherNo = parseInt(last?.formData?.voucherno || 0);
//       const lastBankName =
//         last?.bankdetails?.[0]?.Bankname || "HDFC BANK";

//       setVoucherno(lastVoucherNo + 1);
//       setBankName(lastBankName);
//     } catch (err) {
//       console.error("Error fetching last bank voucher:", err);
//       toast.error("Failed to fetch last voucher details");
//       setVoucherno(1);
//       setBankName("HDFC BANK");
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       fetchLastVoucherAndBank();
//     }
//   }, [show]);

//   // ✅ Save payment
//   const handleSavePayment = async () => {
//     if (!amount || parseFloat(amount) <= 0) {
//       toast.error("Please enter a valid payment amount");
//       return;
//     }

//     if (!bankName) {
//       toast.error("Bank name is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         formData: {
//           date: new Date().toLocaleDateString("en-GB"),
//           vtype: "B",
//           voucherno: voucherno,
//           user: "Owner",
//           totalpayment: amount,
//           totalreceipt: "0.00",
//           totaldiscount: discount,
//           totalbankcharges: "0.00",
//         },
//         items: [
//           {
//             id: 1,
//             accountname: supplier.vacode || "Unknown",
//             pan: supplier.pan || "",
//             Add1: supplier.add1 || "",
//             bsGroup: supplier.bsGroup || "",
//             payment_debit: "0.00",
//             receipt_credit: amount,
//             discount,
//             Total: (parseFloat(amount) + parseFloat(discount)).toFixed(2),
//             bankchargers: "0.00",
//             tdsRs: "0.00",
//             chqnoBank: mode === "Cheque" ? "CHQ-001" : "",
//             remarks,
//             discounted_receipt: (
//               parseFloat(amount) - parseFloat(discount)
//             ).toFixed(2),
//             discounted_payment: "0.00",
//             destination: supplier.city || "",
//             disablePayment: false,
//             disableReceipt: true,
//           },
//         ],
//         bankdetails: [
//           {
//             Bankname: bankName,
//             code: 100032,
//           },
//         ],
//       };

//       const res = await axios.post(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank",
//         payload
//       );

//       if (res.status === 200 || res.status === 201) {
//         toast.success(`Payment saved! Voucher No: ${voucherno}`);
//         onHide();
//         if (onPaymentSaved) onPaymentSaved();
//       } else {
//         toast.error("Failed to save payment");
//       }
//     } catch (error) {
//       console.error("Error saving payment:", error);
//       toast.error("Error saving payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton style={{ backgroundColor: "#e3f2fd" }}>
//         <Modal.Title>Make Payment</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         {initialLoading ? (
//           <div className="text-center">
//             <Spinner animation="border" />
//           </div>
//         ) : entry ? (
//           <>
//             <p><strong>Voucher No:</strong> {voucherno || "--"}</p>
//             <p><strong>Bill No:</strong> {formData.vno}</p>
//             <p><strong>Account Name:</strong> {supplier.vacode}</p>
//             <p><strong>Bill Value:</strong> ₹{formData.grandtotal}</p>

//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Payment Amount</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Discount</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={discount}
//                   onChange={(e) => setDiscount(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Payment Mode</Form.Label>
//                 <Form.Select
//                   value={mode}
//                   onChange={(e) => setMode(e.target.value)}
//                 >
//                   <option>Cash</option>
//                   <option>Cheque</option>
//                   <option>UPI</option>
//                   <option>Bank Transfer</option>
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Bank Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={bankName}
//                   onChange={(e) => setBankName(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Remarks</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                 />
//               </Form.Group>
//             </Form>
//           </>
//         ) : (
//           <p>No entry selected.</p>
//         )}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Cancel
//         </Button>
//         <Button variant="primary" disabled={loading} onClick={handleSavePayment}>
//           {loading ? "Saving..." : "Save Payment"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default PaymentModal;



// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
// import axios from "axios";
// import { toast } from "react-toastify";

// const PaymentModal = ({ show, onHide, entry, onPaymentSaved }) => {
//   const [amount, setAmount] = useState("");
//   const [discount, setDiscount] = useState("0.00");
//   const [mode, setMode] = useState("Cash");
//   const [remarks, setRemarks] = useState("");
//   const [voucherno, setVoucherno] = useState(null);
//   const [bankName, setBankName] = useState("");
//   const [chequeNo, setChequeNo] = useState(""); // ✅ NEW
//   const [tdsRs, setTdsRs] = useState("0.00"); // ✅ NEW
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);

//   const supplier = entry?.customerDetails?.[0] || entry?.supplierdetails?.[0] || {};
//   const formData = entry?.formData || {};

//   // ✅ Fetch last voucher number and bank name
//   const fetchLastVoucherAndBank = async () => {
//     try {
//       setInitialLoading(true);
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last"
//       );

//       const last = res.data?.data;
//       const lastVoucherNo = parseInt(last?.formData?.voucherno || 0);
//       const lastBankName = last?.bankdetails?.[0]?.Bankname || "HDFC BANK";

//       setVoucherno(lastVoucherNo + 1);
//       setBankName(lastBankName);
//     } catch (err) {
//       console.error("Error fetching last bank voucher:", err);
//       toast.error("Failed to fetch last voucher details");
//       setVoucherno(1);
//       setBankName("HDFC BANK");
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (show) {
//       fetchLastVoucherAndBank();

//       // ✅ Auto-fill amount if available
//       const formAmt =
//         formData.grandtotal ||
//         formData.sub_total ||
//         formData.total ||
//         entry?.items?.[0]?.Total ||
//         "0.00";

//       setAmount(parseFloat(formAmt).toFixed(2));
//     }
//   }, [show]);

//   // ✅ Save payment
//   const handleSavePayment = async () => {
//     if (!amount || parseFloat(amount) <= 0) {
//       toast.error("Please enter a valid payment amount");
//       return;
//     }

//     if (!bankName) {
//       toast.error("Bank name is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         formData: {
//           date: new Date().toLocaleDateString("en-GB"),
//           vtype: "B",
//           voucherno: voucherno,
//           user: "Owner",
//           totalpayment: amount,
//           totalreceipt: "0.00",
//           totaldiscount: discount,
//           totalbankcharges: "0.00",
//         },
//         items: [
//           {
//             id: 1,
//             accountname: supplier.vacode || "Unknown",
//             pan: supplier.pan || "",
//             Add1: supplier.add1 || "",
//             bsGroup: supplier.bsGroup || "",
//             payment_debit: "0.00",
//             receipt_credit: amount,
//             discount,
//             Total: (parseFloat(amount) + parseFloat(discount)).toFixed(2),
//             bankchargers: "0.00",
//             tdsRs: tdsRs, // ✅ ADDED FIELD
//             chqnoBank: chequeNo, // ✅ ADDED FIELD
//             remarks,
//             discounted_receipt: (
//               parseFloat(amount) - parseFloat(discount)
//             ).toFixed(2),
//             discounted_payment: "0.00",
//             destination: supplier.city || "",
//             disablePayment: false,
//             disableReceipt: true,
//           },
//         ],
//         bankdetails: [
//           {
//             Bankname: bankName,
//             code: 100032,
//           },
//         ],
//       };

//       const res = await axios.post(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank",
//         payload
//       );

//       if (res.status === 200 || res.status === 201) {
//         toast.success(`Payment saved! Voucher No: ${voucherno}`);
//         onHide();
//         if (onPaymentSaved) onPaymentSaved();
//       } else {
//         toast.error("Failed to save payment");
//       }
//     } catch (error) {
//       console.error("Error saving payment:", error);
//       toast.error("Error saving payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton style={{ backgroundColor: "#e3f2fd" }}>
//         <Modal.Title>Make Payment</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         {initialLoading ? (
//           <div className="text-center">
//             <Spinner animation="border" />
//           </div>
//         ) : entry ? (
//           <>
//             <p><strong>Voucher No:</strong> {voucherno || "--"}</p>
//             <p><strong>Bill No:</strong> {formData.vno}</p>
//             <p><strong>Account Name:</strong> {supplier.vacode}</p>
//             <p><strong>Bill Value:</strong> ₹{formData.grandtotal}</p>

//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Payment Amount</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Discount</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={discount}
//                   onChange={(e) => setDiscount(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Payment Mode</Form.Label>
//                 <Form.Select
//                   value={mode}
//                   onChange={(e) => setMode(e.target.value)}
//                 >
//                   <option>Cash</option>
//                   <option>Cheque</option>
//                   <option>UPI</option>
//                   <option>Bank Transfer</option>
//                 </Form.Select>
//               </Form.Group>

//               {/* ✅ Show Cheque No field only if mode is Cheque */}
//               {mode === "Cheque" && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Cheque No.</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={chequeNo}
//                     onChange={(e) => setChequeNo(e.target.value)}
//                     placeholder="Enter cheque number"
//                   />
//                 </Form.Group>
//               )}

//               {/* ✅ New TDS Field */}
//               <Form.Group className="mb-3">
//                 <Form.Label>TDS (₹)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={tdsRs}
//                   onChange={(e) => setTdsRs(e.target.value)}
//                   placeholder="Enter TDS amount"
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Bank Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={bankName}
//                   onChange={(e) => setBankName(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Remarks</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                 />
//               </Form.Group>
//             </Form>
//           </>
//         ) : (
//           <p>No entry selected.</p>
//         )}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Cancel
//         </Button>
//         <Button variant="primary" disabled={loading} onClick={handleSavePayment}>
//           {loading ? "Saving..." : "Save Payment"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default PaymentModal;



import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentModal = ({ show, onHide, entry, onPaymentSaved }) => {
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("0.00");
  const [chqnoBank, setChqnoBank] = useState("");
  const [tdsRs, setTdsRs] = useState("0.00");
  const [remarks, setRemarks] = useState("");
  const [voucherno, setVoucherno] = useState(null);
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const supplier = entry?.customerDetails?.[0] || {};
  const formData = entry?.formData || {};

  // ✅ Fetch last voucher number and bank name
  const fetchLastVoucherAndBank = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last"
      );

      const last = res.data?.data;
      const lastVoucherNo = parseInt(last?.formData?.voucherno || 0);
      const lastBankName = last?.bankdetails?.[0]?.Bankname || "HDFC BANK";

      setVoucherno(lastVoucherNo + 1);
      setBankName(lastBankName);
    } catch (err) {
      console.error("Error fetching last bank voucher:", err);
      toast.error("Failed to fetch last voucher details");
      setVoucherno(1);
      setBankName("HDFC BANK");
    } finally {
      setInitialLoading(false);
    }
  };

  // ✅ Auto-fill amount from entry
  useEffect(() => {
    if (entry?.formData?.grandtotal) {
      setAmount(entry.formData.grandtotal);
    }
  }, [entry]);

  useEffect(() => {
    if (show) {
      fetchLastVoucherAndBank();
    }
  }, [show]);

  // ✅ Save payment
  const handleSavePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (!bankName) {
      toast.error("Bank name is required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        formData: {
          date: new Date().toLocaleDateString("en-GB"),
          vtype: "B",
          voucherno: voucherno,
          user: "Owner",
          totalpayment: amount,
          totalreceipt: "0.00",
          totaldiscount: discount,
          totalbankcharges: "0.00",
        },
        items: [
          {
            id: 1,
            accountname: supplier.vacode || "Unknown",
            pan: supplier.pan || "",
            Add1: supplier.Add1 || "",
            bsGroup: supplier.bsGroup || "",
            payment_debit: amount,
            receipt_credit: "0.00",
            discount,
            Total: (parseFloat(amount) + parseFloat(discount)).toFixed(2),
            bankchargers: "0.00",
            tdsRs: tdsRs,
            chqnoBank: chqnoBank, // ✅ ADDED FIELD
            // chqnoBank: chqnoBank ? `CH No. ${chqnoBank}` : "",
            remarks,
            discounted_receipt:"0.00",
            discounted_payment: (
              parseFloat(amount) - parseFloat(discount)
            ).toFixed(2),
            destination: supplier.city || "",
            disablePayment: false,
            disableReceipt: true,
          },
        ],
        bankdetails: [
          {
            Bankname: bankName,
            code: 100032,
          },
        ],
      };

      const res = await axios.post(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank",
        payload
      );

      if (res.status === 200 || res.status === 201) {
        toast.success(`Payment saved! Voucher No: ${voucherno}`);
        onHide();
        if (onPaymentSaved) onPaymentSaved();
      } else {
        toast.error("Failed to save payment");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Error saving payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#e3f2fd" }}>
        <Modal.Title>Make Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {initialLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : entry ? (
          <>
            <p><strong>Voucher No:</strong> {voucherno || "--"}</p>
            <p><strong>Bill No:</strong> {formData.vno}</p>
            <p><strong>Account Name:</strong> {supplier.vacode}</p>
            <p><strong>Bill Value:</strong> ₹{formData.grandtotal}</p>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Payment Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount</Form.Label>
                <Form.Control
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </Form.Group>

             <Form.Group className="mb-3">
            <Form.Label>Cheque No.</Form.Label>
            <Form.Control
                type="text"
                value={
                chqnoBank.startsWith("CH No.")
                    ? chqnoBank
                    : chqnoBank
                    ? `CH No. ${chqnoBank}`
                    : ""
                }
                onChange={(e) => {
                let val = e.target.value;
                // Remove extra "Cheq No." if user deletes
                if (val.toLowerCase().startsWith("Ch No.")) {
                    val = val.replace(/^CH No\. ?/i, "");
                }
                setChqnoBank(val);
                }}
                placeholder="CH No."
            />
            </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>TDS Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={tdsRs}
                  onChange={(e) => setTdsRs(e.target.value)}
                  placeholder="Enter TDS amount"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form.Group>
            </Form>
          </>
        ) : (
          <p>No entry selected.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" disabled={loading} onClick={handleSavePayment}>
          {loading ? "Saving..." : "Save Payment"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
