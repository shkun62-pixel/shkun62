// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ReceiptModal = ({ show, onHide, entry, onPaymentSaved }) => {
//   const [amount, setAmount] = useState("");
//   const [discount, setDiscount] = useState("0.00");
//   const [chqnoBank, setChqnoBank] = useState("");
//   const [tdsRs, setTdsRs] = useState("0.00");
//   const [remarks, setRemarks] = useState("");
//   const [voucherno, setVoucherno] = useState(null);
//   const [bankName, setBankName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(false);

//   const supplier = entry?.customerDetails?.[0] || {};
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

//   // ✅ Auto-fill amount from entry
//   useEffect(() => {
//     if (entry?.formData?.grandtotal) {
//       setAmount(entry.formData.grandtotal);
//     }
//   }, [entry]);

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
//           totalpayment: "0.00",
//           totalreceipt: amount,
//           totaldiscount: discount,
//           totalbankcharges: "0.00",
//         },
//         items: [
//           {
//             id: 1,
//             accountname: supplier.vacode || "Unknown",
//             pan: supplier.pan || "",
//             Add1: supplier.Add1 || "",
//             bsGroup: supplier.bsGroup || "",
//             payment_debit: "0.00",
//             receipt_credit: amount,
//             discount,
//             Total: (parseFloat(amount) + parseFloat(discount)).toFixed(2),
//             bankchargers: "0.00",
//             tdsRs: tdsRs,
//             chqnoBank: chqnoBank, // ✅ ADDED FIELD
//             // chqnoBank: chqnoBank ? `CH No. ${chqnoBank}` : "",
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

//      <Modal.Body>
//   {initialLoading ? (
//     <div className="text-center">
//       <Spinner animation="border" />
//     </div>
//   ) : entry ? (
//     <>
//       <p><strong>Voucher No:</strong> {voucherno || "--"}</p>
//       <p><strong>Bill No:</strong> {formData.vno}</p>
//       <p><strong>Account Name:</strong> {supplier.vacode}</p>
//       <p><strong>Bill Value:</strong> ₹{formData.grandtotal}</p>

//       <Form>
//         {/* Row 1 - Payment Amount + Discount */}
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <Form.Label>Payment Amount</Form.Label>
//             <Form.Control
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//           </div>

//           <div className="col-md-6 mb-3">
//             <Form.Label>Discount</Form.Label>
//             <Form.Control
//               type="number"
//               value={discount}
//               onChange={(e) => setDiscount(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Row 2 - TDS Amount + Cheque No */}
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <Form.Label>TDS Amount</Form.Label>
//             <Form.Control
//               type="number"
//               value={tdsRs}
//               onChange={(e) => setTdsRs(e.target.value)}
//               placeholder="Enter TDS amount"
//             />
//           </div>

//           <div className="col-md-6 mb-3">
//             <Form.Label>Cheque No.</Form.Label>
//             <Form.Control
//               type="text"
//               value={
//                 chqnoBank.startsWith("CH No.")
//                   ? chqnoBank
//                   : chqnoBank
//                   ? `CH No. ${chqnoBank}`
//                   : ""
//               }
//               onChange={(e) => {
//                 let val = e.target.value;
//                 if (val.toLowerCase().startsWith("ch no.")) {
//                   val = val.replace(/^ch no\. ?/i, "");
//                 }
//                 setChqnoBank(val);
//               }}
//               placeholder="CH No."
//             />
//           </div>
//         </div>

//         {/* Bank Name */}
//         <Form.Group className="mb-3">
//           <Form.Label>Bank Name</Form.Label>
//           <Form.Control
//             type="text"
//             value={bankName}
//             onChange={(e) => setBankName(e.target.value)}
//           />
//         </Form.Group>

//         {/* Remarks */}
//         <Form.Group className="mb-3">
//           <Form.Label>Remarks</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={2}
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//           />
//         </Form.Group>
//       </Form>
//     </>
//   ) : (
//     <p>No entry selected.</p>
//   )}
// </Modal.Body>


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

// export default ReceiptModal;



import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const ReceiptModal = ({ show, onHide, entry, onPaymentSaved }) => {
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("0.00");
  const [discountPercent, setDiscountPercent] = useState("0");
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
      setAmount(parseFloat(entry.formData.balance).toFixed(2));
    }
  }, [entry]);

  useEffect(() => {
    if (show) {
      fetchLastVoucherAndBank();
    }
  }, [show]);

  // ✅ Sync discount when % changes
  const handleDiscountPercentChange = (value) => {
    setDiscountPercent(value);
    const percent = parseFloat(value) || 0;
    const amt = parseFloat(amount) || 0;
    const calcDiscount = (amt * percent) / 100;
    setDiscount(calcDiscount.toFixed(2));
  };

  // ✅ Sync discount % when ₹ value changes manually
  const handleDiscountChange = (value) => {
    setDiscount(value);
    const amt = parseFloat(amount) || 0;
    const disc = parseFloat(value) || 0;
    if (amt > 0) {
      const percent = (disc / amt) * 100;
      setDiscountPercent(percent.toFixed(2));
    }
  };

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
      // 🧮 Always format numeric fields to two decimals
      const formattedAmount = parseFloat(amount || 0).toFixed(2);
      const formattedDiscount = parseFloat(discount || 0).toFixed(2);
      const formattedTds = parseFloat(tdsRs || 0).toFixed(2);

      const payload = {
        formData: {
          date: new Date().toLocaleDateString("en-GB"),
          vtype: "B",
          voucherno: voucherno,
          user: "Owner",
          totalpayment: "0.00",
          totalreceipt: formattedAmount,
          totaldiscount: formattedDiscount,
          totalbankcharges: "0.00",
          againstbillno: formData.vno || "",
        },
        items: [
          {
            id: 1,
            accountname: supplier.vacode || "Unknown",
            pan: supplier.pan || "",
            Add1: supplier.Add1 || "",
            bsGroup: supplier.bsGroup || "",
            payment_debit: "0.00",
            receipt_credit: formattedAmount,
            discount: formattedDiscount,
            Total: (parseFloat(formattedAmount) + parseFloat(formattedDiscount)).toFixed(2),
            bankchargers: "0.00",
            tdsRs: formattedTds,
            chqnoBank: chqnoBank.startsWith("CH No.")
              ? chqnoBank
              : chqnoBank
              ? `CH No. ${chqnoBank}`
              : "",
            remarks,
            discounted_receipt: (
              parseFloat(formattedAmount) - parseFloat(formattedDiscount)
            ).toFixed(2),
            discounted_payment: "0.00",
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

  // const handleSavePayment = async () => {
  //   if (!amount || parseFloat(amount) <= 0) {
  //     toast.error("Please enter a valid payment amount");
  //     return;
  //   }

  //   if (!bankName) {
  //     toast.error("Bank name is required");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = {
  //       formData: {
  //         date: new Date().toLocaleDateString("en-GB"),
  //         vtype: "B",
  //         voucherno: voucherno,
  //         user: "Owner",
  //         totalpayment: "0.00",
  //         totalreceipt: amount,
  //         totaldiscount: discount,
  //         totalbankcharges: "0.00",
  //         againstbillno: formData.vno || "",
  //       },
  //       items: [
  //         {
  //           id: 1,
  //           accountname: supplier.vacode || "Unknown",
  //           pan: supplier.pan || "",
  //           Add1: supplier.Add1 || "",
  //           bsGroup: supplier.bsGroup || "",
  //           payment_debit: "0.00",
  //           receipt_credit: amount,
  //           discount,
  //           Total: (parseFloat(amount) + parseFloat(discount)).toFixed(2),
  //           bankchargers: "0.00",
  //           tdsRs,
  //           chqnoBank: chqnoBank.startsWith("CH No.")
  //             ? chqnoBank
  //             : chqnoBank
  //             ? `CH No. ${chqnoBank}`
  //             : "",
  //           remarks,
  //           discounted_receipt: (
  //             parseFloat(amount) - parseFloat(discount)
  //           ).toFixed(2),
  //           discounted_payment: "0.00",
  //           destination: supplier.city || "",
  //           disablePayment: false,
  //           disableReceipt: true,
  //         },
  //       ],
  //       bankdetails: [
  //         {
  //           Bankname: bankName,
  //           code: 100032,
  //         },
  //       ],
  //     };

  //     const res = await axios.post(
  //       "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank",
  //       payload
  //     );

  //     if (res.status === 200 || res.status === 201) {
  //       toast.success(`Payment saved! Voucher No: ${voucherno}`);
  //       onHide();
  //       if (onPaymentSaved) onPaymentSaved();
  //     } else {
  //       toast.error("Failed to save payment");
  //     }
  //   } catch (error) {
  //     console.error("Error saving payment:", error);
  //     toast.error("Error saving payment");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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
            {/* <p><strong>Voucher No:</strong> {voucherno || "--"}</p> */}
            <p style={{fontSize:18}}><strong>Bill No:</strong> {formData.vno}</p>
            <p style={{fontSize:18}}><strong>Account Name:</strong> {supplier.vacode}</p>
            <p style={{fontSize:18}}><strong>Bill Value:</strong> ₹{formData.grandtotal}</p>
            <p style={{fontSize:18}}><strong>Balance Value:</strong> ₹{(entry.formData.balance).toFixed(2)}</p>
           

            <hr/>

            <Form>
              {/* Row 1 - Payment Amount + Discount (%) */}
              <div className="row" style={{marginTop:"10px"}}>
                <div className="col-md-6 mb-2">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={discountPercent}
                    onChange={(e) => handleDiscountPercentChange(e.target.value)}
                    placeholder="Enter discount percentage"
                  />
                </div>
                 <div className="col-md-6 mb-2">
                  <Form.Label>Discount (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    placeholder="Enter discount amount"
                  />
                </div>
              </div>

              {/* Row 2 - Discount (₹) + TDS */}
              <div className="row">
                <div className="col-md-6 mb-2">
                  <Form.Label>Receipt Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount - discount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter payment amount"
                  />
                </div>
               

                <div className="col-md-6 mb-2">
                  <Form.Label>TDS Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={tdsRs}
                    onChange={(e) => setTdsRs(e.target.value)}
                    placeholder="Enter TDS amount"
                  />
                </div>
              </div>

              {/* Row 3 - Cheque No. + Bank Name */}
              <div className="row">
                <div className="col-md-6 mb-2">
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
                      if (val.toLowerCase().startsWith("ch no.")) {
                        val = val.replace(/^ch no\. ?/i, "");
                      }
                      setChqnoBank(val);
                    }}
                    placeholder="CH No."
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
              </div>

              {/* Remarks */}
              <Form.Group className="mb-2">
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

export default ReceiptModal;
