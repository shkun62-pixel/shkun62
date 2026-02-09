import React,{useEffect,useState} from "react";
import HsnDetail from "./HsnWiseReport/HsnDetail";
import AcwiseGstRep from "./AccWiseGstReport/AcwiseGstRep";

import { useNavigate, useLocation } from "react-router-dom";

const GstReport = () => {
  const [openPurRep, setopenPurRep] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read query parameter
  const query = new URLSearchParams(location.search);
  const type = query.get("type");  // "party" or "account"

  useEffect(() => {
    setopenPurRep(true);
  }, []);

  const handleClose = () => {
    setopenPurRep(false);
    navigate("/");
  };

  return (
    <div>
      {type === "HsnWise" && (
        <HsnDetail show={openPurRep} onHide={handleClose} />
      )}
       {type === "AcwiseGstReport" && (
        <AcwiseGstRep show={openPurRep} onHide={handleClose} />
      )}
    </div>
  );
};

export default GstReport;
