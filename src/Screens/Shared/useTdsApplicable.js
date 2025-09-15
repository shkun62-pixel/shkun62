import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function useTdsApplicable() {
  const [applicable194Q, setApplicable194Q] = useState(null);

  useEffect(() => {
    const fetchCompany194Q = async () => {
      try {
        const response = await fetch(
          "http://192.168.1.16:3012/03AEZFS6485G1BA_02072025_02072026/tenant/getcompany194Q/6864f488ef08143e3e852de5"
        );

        if (!response.ok) throw new Error("Failed to fetch company 194Q");

        const data = await response.json();

        setApplicable194Q(data.applicable194Q);

      } catch (error) {
        console.error("Error fetching company 194Q:", error.message);
      }
    };

    fetchCompany194Q();
  }, []);

  return { applicable194Q };
}
