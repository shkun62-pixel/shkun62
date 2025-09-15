import React,{useRef,useState} from 'react'
import Table from "react-bootstrap/Table";
const Example = () => {

  const accountNameRefs = useRef([]);
  const narrationRefs = useRef([]);
  const paymentRefs = useRef([]);
  const receiptRefs = useRef([]);
  const discountRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const tableRef = useRef(null);

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

  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter") {
      switch (field) {
        case "accountname":
          if (items[index].accountname.trim() === "") {
            saveButtonRef.current.focus();
          } else {
            narrationRefs.current[index]?.focus();
          }
          break;
          case "narration":
              if (items[index].disablePayment) {
                // If debit is disabled, move focus to credit
                receiptRefs.current[index]?.focus();
              } else {
                paymentRefs.current[index]?.focus();
              }
        
            break;
        case "payment_debit":
          if (!items[index].disableReceipt) {
            receiptRefs.current[index]?.focus();
          } else {
            if (
              accountNameRefs.current[index].value.trim().length > 0 &&
              items[index].payment_debit.trim().length > 0
            ) {
              discountRefs.current[index]?.focus();
            } else {
              alert("Account name and Payment/Receipt cannot be empty");
              paymentRefs.current[index]?.focus();
            }
          }
          break;
        case "receipt_credit":
          if (accountNameRefs.current[index].value.trim().length > 0 && items[index].receipt_credit.trim().length > 0) {
            discountRefs.current[index]?.focus();
          } else {
            alert("Account name and Payment/Receipt cannot be empty");
            receiptRefs.current[index]?.focus();
          }
          break;
        case "discount":
          if (index === items.length - 1) {
            // handleAddItem();
            accountNameRefs.current[index + 1]?.focus();
          } else {
            accountNameRefs.current[index + 1]?.focus();
          }
          break;
        default:
          break;
      }
    } 
    // Move Right (→)
    else if (event.key === "ArrowRight") {
      if (field === "accountname"){ narrationRefs.current[index]?.focus();
        setTimeout(() => narrationRefs.current[index]?.select(), 0);
      }
      if (field === "narration") {
        if (!items[index].disablePayment){ paymentRefs.current[index]?.focus();
          setTimeout(() => paymentRefs.current[index]?.select(), 0);
        }
        else {receiptRefs.current[index]?.focus();
        setTimeout(() => receiptRefs.current[index]?.select(), 0);
        }
      }
      // else if (field === "narration"){ paymentRefs.current[index]?.focus();
      //   setTimeout(() => paymentRefs.current[index]?.select(), 0);
      // }
      else if (field === "payment_debit" && !items[index].disableReceipt){
        receiptRefs.current[index]?.focus();
        setTimeout(() => receiptRefs.current[index]?.select(), 0);
      }
      else if (field === "payment_debit" && items[index].disableReceipt){
        discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      }
      else if (field === "receipt_credit"){ discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      }
    } 
    // Move Left (←)
    else if (event.key === "ArrowLeft") {
      if (field === "discount") {
        if (!items[index].disableReceipt){ receiptRefs.current[index]?.focus();
          setTimeout(() => receiptRefs.current[index]?.select(), 0);
        }
        else {paymentRefs.current[index]?.focus();
        setTimeout(() => paymentRefs.current[index]?.select(), 0);
        }
      } 
      if (field === "receipt_credit") {
        if (!items[index].disablePayment){ discountRefs.current[index]?.focus();
          setTimeout(() => discountRefs.current[index]?.select(), 0);
        }
        else {narrationRefs.current[index]?.focus();
        setTimeout(() => narrationRefs.current[index]?.select(), 0);
        }
      } 
      // else if (field === "receipt_credit"){ paymentRefs.current[index]?.focus();
      //   setTimeout(() => paymentRefs.current[index]?.select(), 0);
      // }
      else if (field === "payment_debit"){ narrationRefs.current[index]?.focus();
        setTimeout(() => narrationRefs.current[index]?.select(), 0);
      }
      else if (field === "narration"){ accountNameRefs.current[index]?.focus();
        setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      }
    } 

    // Move Up
 else if (event.key === "ArrowUp" && index > 0) {
  setTimeout(() => {
    if (field === "accountname") accountNameRefs.current[index - 1]?.focus();
    else if (field === "narration") narrationRefs.current[index - 1]?.focus();
    else if (field === "payment_debit") paymentRefs.current[index - 1]?.focus();
    else if (field === "receipt_credit") receiptRefs.current[index - 1]?.focus();
    else if (field === "discount") discountRefs.current[index - 1]?.focus();
  }, 100);
} 
// Move Down
else if (event.key === "ArrowDown" && index < items.length - 1) {
  setTimeout(() => {
    if (field === "accountname") accountNameRefs.current[index + 1]?.focus();
    else if (field === "narration") narrationRefs.current[index + 1]?.focus();
    else if (field === "payment_debit") paymentRefs.current[index + 1]?.focus();
    else if (field === "receipt_credit") receiptRefs.current[index + 1]?.focus();
    else if (field === "discount") discountRefs.current[index + 1]?.focus();
  }, 100);
} 
  };

  return (
    <div>
      <Table ref={tableRef} className="custom-table">
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
          </tr>
        </thead>
        <tbody style={{ overflowY: "auto", maxHeight: "calc(520px - 40px)" }}>
          {items.map((item, index) => (
            <tr key={`${item.accountname}-${index}`}>
              {" "}
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
                  onKeyDown={(e) => {
                    handleKeyDown(e, index, "accountname")
                  }}
                
                  ref={(el) => (accountNameRefs.current[index] = el)}
                />
              </td>
              <td style={{ padding: 0 }}>
                <input
                className="Narration"
                  style={{
                    height: 40,
                    width: "100%",
                    boxSizing: "border-box",
                    border: "none",
                    padding: 5,
                  }}
                  value={item.narration}
                  ref={(el) => (narrationRefs.current[index] = el)}
                  onKeyDown={(e) => {
                    handleKeyDown(e, index, "narration");
                  }}
                />
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
                  disabled={item.disablePayment}
                  ref={(el) => (paymentRefs.current[index] = el)}
                  onKeyDown={(e) => handleKeyDown(e, index, "payment_debit")}
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
                  disabled={item.disableReceipt}
                  ref={(el) => (receiptRefs.current[index] = el)}
                  onKeyDown={(e) => handleKeyDown(e, index, "receipt_credit")}
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
                  ref={(el) => (discountRefs.current[index] = el)}
                  onKeyDown={(e) => handleKeyDown(e, index, "discount")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Example