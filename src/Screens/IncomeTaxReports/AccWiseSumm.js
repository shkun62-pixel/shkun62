import React,{useState,useEffect} from "react";
import AccountWiseSummPur from "./AccountWiseSummPur";

const AccWiseSumm = () => {
  const [openPurRep, setopenPurRep] = useState(false);

  useEffect(() => {
    // Auto open the modal when component mounts
    setopenPurRep(true);
  }, []);
  return (
    <div>
      <AccountWiseSummPur
        show={openPurRep}
        onClose={() => setopenPurRep(false)}
      />
    </div>
  );
};

export default AccWiseSumm;
