import React,{useEffect,useState} from "react";
import PartyWiseSummPur from "./PartyWiseSummPur";
import { useNavigate } from "react-router-dom";

const IncomeTaxReport = () => {
  const [openPurRep, setopenPurRep] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto open the modal when component mounts
    setopenPurRep(true);
  }, []);

    const handleClose = () => {
        setopenPurRep(false);
        navigate("/")
    };

  return (
    <div>
      <PartyWiseSummPur
        show={openPurRep}
        onClose={handleClose}
      />
    </div>
  );
};

export default IncomeTaxReport;
