// import React,{useEffect,useState} from "react";
// import PartyWiseSummPur from "./PartyWiseSummPur";
// import AccountWiseSummPur from "./AccountWiseSummPur";
// import { useNavigate } from "react-router-dom";

// const IncomeTaxReport = () => {
//   const [openPurRep, setopenPurRep] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Auto open the modal when component mounts
//     setopenPurRep(true);
//   }, []);

//     const handleClose = () => {
//         setopenPurRep(false);
//         navigate("/")
//     };

//   return (
//     <div>
//       <PartyWiseSummPur
//         show={openPurRep}
//         onClose={handleClose}
//       />

//        <AccountWiseSummPur
//         show={openPurRep}
//         onClose={() => setopenPurRep(false)}
//       />
//     </div>
//   );
// };

// export default IncomeTaxReport;


import React,{useEffect,useState} from "react";
import RepostingModal from "./RepostingModal";

import { useNavigate, useLocation } from "react-router-dom";

const Repost = () => {
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
      {type === "Reposting" && (
        <RepostingModal open={openPurRep} onClose={handleClose} />
      )}

    </div>
  );
};

export default Repost;
