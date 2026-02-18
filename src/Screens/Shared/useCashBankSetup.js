import { useState, useEffect } from "react";

export default function useCompanySetup() {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const [b1, setb1] = useState(null);
  const [b2, setb2] = useState(null);
  const [b3, setb3] = useState(null);
  const [b4, setb4] = useState(null);
  const [b5, setb5] = useState(null);
  const [decimals, setDecimals] = useState(null);
  
  useEffect(() => {
    const fetchCashBankSetup = async () => {
      try {
        const response = await fetch(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/cashbanksetup`
        );
        if (!response.ok) throw new Error("Failed to fetch sales setup");

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].formData) {
          const formDataFromAPI = data[0].formData;
          setb1(formDataFromAPI.B1);
          setb2(formDataFromAPI.B2);
          setb3(formDataFromAPI.B3);
          setb4(formDataFromAPI.B4);
          setb5(formDataFromAPI.B5);
          setDecimals(formDataFromAPI.decimals);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching sales setup:", error.message);
      }
    };

    fetchCashBankSetup();
  }, []);

  return { b1, b2, b3, b4, b5, decimals };
}
