// // hooks/useLedgerAccounts.js
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function useLedgerAccounts() {
//   const [ledgerData, setLedgerData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
//       )
//       .then((res) => {
//         if (res.data?.data) {
//           setLedgerData(res.data.data.map((d) => d.formData));
//         }
//       })
//       .catch((err) => {
//         console.error("Ledger API Error:", err);
//         setError(err);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const getUniqueValues = (key) => {
//     return [...new Set(ledgerData.map((item) => item[key]).filter(Boolean))];
//   };

//   return { ledgerData, getUniqueValues, loading, error };
// }


// hooks/useLedgerAccounts.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function useLedgerAccounts() {
  const [ledgerData, setLedgerData] = useState([]);
  const [existingGstList, setExistingGstList] = useState([]);
  const [existingpanList, setexistingpanList] = useState([]);
  const [existingTdsList, setexistingTdsList] = useState([]);
  const [existingAccList, setexistingAccList] = useState([]);
  const [existingAdharList, setexistingAdharList] = useState([]);
  const [existingAcCodeList, setexistingAcCodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
      )
      .then((res) => {
        if (res.data?.data) {
          const formDataList = res.data.data.map((d) => d.formData);
          setLedgerData(formDataList);

          // Extract GST numbers
          const gstNumbers = formDataList
            .map((item) => item?.gstNo?.toUpperCase())
            .filter(Boolean);
          setExistingGstList(gstNumbers);
           // Extract PAN numbers
          const panNumbers = formDataList
            .map((item) => item?.pan?.toUpperCase())
            .filter(Boolean);
          setexistingpanList(panNumbers);
            // Extract TDS numbers
          const tdsNumbers = formDataList
            .map((item) => item?.tdsno?.toUpperCase())
            .filter(Boolean);
          setexistingTdsList(tdsNumbers);
              // Extract Adhar numbers
          const adNumbers = formDataList
            .map((item) => item?.collc?.toUpperCase())
            .filter(Boolean);
          setexistingAdharList(adNumbers);
        // Extract Acc numbers
          const accNumbers = formDataList
            .map((item) => item?.Rc?.toUpperCase())
            .filter(Boolean);
          setexistingAccList(accNumbers);
              // Extract acode numbers
         const acodeNumbers = formDataList
        .map((item) => (item?.acode ? String(item.acode).toUpperCase() : null))
        .filter(Boolean);
        setexistingAcCodeList(acodeNumbers);
        
        }
      })
      .catch((err) => {
        console.error("Ledger API Error:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getUniqueValues = (key) => {
    return [...new Set(ledgerData.map((item) => item[key]).filter(Boolean))];
  };

  return { ledgerData, existingGstList, existingpanList, existingTdsList, existingAdharList, existingAccList, existingAcCodeList, getUniqueValues, loading, error };
}
