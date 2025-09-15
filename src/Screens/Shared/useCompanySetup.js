import { useState, useEffect } from "react";

export default function useCompanySetup() {
  const [companyName, setCompanyName] = useState(null);
  const [CompanyState, setCompanyState] = useState(null);
  const [companyAdd, setCompanyAdd] = useState(null);
  const [companyCity, setCompanyCity] = useState(null);
  const [companyPhn, setCompanyPhn] = useState(null);
  const [companyPhn2, setCompanyPhn2] = useState(null);
  const [companyGST, setCompanyGST] = useState(null);
  const [companyPAN, setCompanyPAN] = useState(null);
  const [companyDesc, setCompanyDesc] = useState(null);
  const [companyEmail, setCompanyEmail] = useState(null);
  const [unitType, setunitType] = useState(null);
  const [dateFrom, setdateFrom] = useState(null);
  const [cPin, setCPin] = useState(null);

  useEffect(() => {
    const fetchCompanySetup = async () => {
      try {
        const response = await fetch(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/company`
        );
        if (!response.ok) throw new Error("Failed to fetch sales setup");

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].formData) {
          const formDataFromAPI = data[0].formData;
          setCompanyName(formDataFromAPI.Ahead);
          setCompanyAdd(formDataFromAPI.Add1);
          setCompanyCity(formDataFromAPI.city);
          setCompanyPhn(formDataFromAPI.Office);
          setCompanyPhn2(formDataFromAPI.Resi);
          setCompanyGST(formDataFromAPI.Gstno);
          setCompanyPAN(formDataFromAPI.pan);
          setCompanyDesc(formDataFromAPI.item);
          setCompanyEmail(formDataFromAPI.Email);
          setCompanyState(formDataFromAPI.state);
          setunitType(formDataFromAPI.unitType);
          setdateFrom(formDataFromAPI.Afrom);
          setCPin(formDataFromAPI.pin);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching sales setup:", error.message);
      }
    };

    fetchCompanySetup();
  }, []);

  return { companyName, companyAdd, companyCity, companyPhn, companyPhn2, companyGST, companyPAN, companyDesc, companyEmail, CompanyState, unitType, dateFrom, cPin };
}
