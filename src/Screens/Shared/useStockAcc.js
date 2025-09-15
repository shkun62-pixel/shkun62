// hooks/useLedgerAccounts.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function useStockAcc() {
  const [stockData, setstockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster"
      )
      .then((res) => {
        if (res.data?.data) {
          setstockData(res.data.data.map((d) => d.formData));
        }
      })
      .catch((err) => {
        console.error("Ledger API Error:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getUniqueValues = (key) => {
    return [...new Set(stockData.map((item) => item[key]).filter(Boolean))];
  };

  return { stockData, getUniqueValues, loading, error };
}
