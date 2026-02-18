// hooks/useLedgerAccounts.js
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function useLedgerAccounts() {
//   const [ledgerData, setLedgerData] = useState([]);
//   const [existingGstList, setExistingGstList] = useState([]);
//   const [existingpanList, setexistingpanList] = useState([]);
//   const [existingTdsList, setexistingTdsList] = useState([]);
//   const [existingAccList, setexistingAccList] = useState([]);
//   const [existingAdharList, setexistingAdharList] = useState([]);
//   const [existingAcCodeList, setexistingAcCodeList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
//       )
//       .then((res) => {
//         if (res.data?.data) {
//           const formDataList = res.data.data.map((d) => d.formData);
//           setLedgerData(formDataList);

//           // Extract GST numbers
//           const gstNumbers = formDataList
//             .map((item) => item?.gstNo?.toUpperCase())
//             .filter(Boolean);
//           setExistingGstList(gstNumbers);
//            // Extract PAN numbers
//           const panNumbers = formDataList
//             .map((item) => item?.pan?.toUpperCase())
//             .filter(Boolean);
//           setexistingpanList(panNumbers);
//             // Extract TDS numbers
//           const tdsNumbers = formDataList
//             .map((item) => item?.tdsno?.toUpperCase())
//             .filter(Boolean);
//           setexistingTdsList(tdsNumbers);
//               // Extract Adhar numbers
//           const adNumbers = formDataList
//             .map((item) => item?.collc?.toUpperCase())
//             .filter(Boolean);
//           setexistingAdharList(adNumbers);
//         // Extract Acc numbers
//           const accNumbers = formDataList
//             .map((item) => item?.Rc?.toUpperCase())
//             .filter(Boolean);
//           setexistingAccList(accNumbers);
//               // Extract acode numbers
//          const acodeNumbers = formDataList
//         .map((item) => (item?.acode ? String(item.acode).toUpperCase() : null))
//         .filter(Boolean);
//         setexistingAcCodeList(acodeNumbers);
        
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

//   return { ledgerData, existingGstList, existingpanList, existingTdsList, existingAdharList, existingAccList, existingAcCodeList, getUniqueValues, loading, error };
// }

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function useLedgerAccounts() {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const [ledgerData, setLedgerData] = useState([]);
  const [existingGstList, setExistingGstList] = useState([]);
  const [existingpanList, setexistingpanList] = useState([]);
  const [existingTdsList, setexistingTdsList] = useState([]);
  const [existingAccList, setexistingAccList] = useState([]);
  const [existingAdharList, setexistingAdharList] = useState([]);
  const [existingAcCodeList, setexistingAcCodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Move API logic into reusable function
  const fetchLedgerAccounts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`
      );

      if (res.data?.data) {
        const formDataList = res.data.data.map((d) => d.formData);
        setLedgerData(formDataList);

        setExistingGstList(
          formDataList.map((i) => i?.gstNo?.toUpperCase()).filter(Boolean)
        );

        setexistingpanList(
          formDataList.map((i) => i?.pan?.toUpperCase()).filter(Boolean)
        );

        setexistingTdsList(
          formDataList.map((i) => i?.tdsno?.toUpperCase()).filter(Boolean)
        );

        setexistingAdharList(
          formDataList.map((i) => i?.collc?.toUpperCase()).filter(Boolean)
        );

        setexistingAccList(
          formDataList.map((i) => i?.Rc?.toUpperCase()).filter(Boolean)
        );

        setexistingAcCodeList(
          formDataList
            .map((i) => (i?.acode ? String(i.acode).toUpperCase() : null))
            .filter(Boolean)
        );
      }
    } catch (err) {
      console.error("Ledger API Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 👇 Initial load
  useEffect(() => {
    fetchLedgerAccounts();
  }, [fetchLedgerAccounts]);

  const getUniqueValues = (key) => {
    return [...new Set(ledgerData.map((item) => item[key]).filter(Boolean))];
  };

  return {
    ledgerData,
    existingGstList,
    existingpanList,
    existingTdsList,
    existingAdharList,
    existingAccList,
    existingAcCodeList,
    getUniqueValues,
    fetchLedgerAccounts,   // 👈 EXPOSE THIS
    loading,
    error,
  };
}
