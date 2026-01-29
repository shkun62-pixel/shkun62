// import React, { useEffect, useState } from "react";
// import { Modal, Button, Table } from "react-bootstrap";
// import axios from "axios";

// const LedgerSummaryResultModal = ({ show, onHide, filters }) => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!show || !filters) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
//         );

//         if (res.data?.success && Array.isArray(res.data.data)) {
//           // Flatten all transactions
//           let allTransactions = res.data.data.flatMap(v => v.transactions);

//           // Apply filters
//           if (filters.fromDate && filters.uptoDate) {
//             const from = new Date(filters.fromDate.split("/").reverse().join("-"));
//             const upto = new Date(filters.uptoDate.split("/").reverse().join("-"));
//             allTransactions = allTransactions.filter(tx => {
//               const txDate = new Date(tx.date);
//               return txDate >= from && txDate <= upto;
//             });
//           }

//           if (filters.stateName) {
//             allTransactions = allTransactions.filter(tx =>
//               tx.state?.toLowerCase().includes(filters.stateName.toLowerCase())
//             );
//           }

//           if (filters.city) {
//             allTransactions = allTransactions.filter(tx =>
//               tx.city?.toLowerCase().includes(filters.city.toLowerCase())
//             );
//           }

//           if (filters.annexure && filters.annexure !== "All") {
//             allTransactions = allTransactions.filter(tx =>
//               tx.Bsgroup === filters.annexure
//             );
//           }

//           if (filters.balance === "Active Balance") {
//             // Filter only accounts with non-zero closing? (example)
//             // For demo, we keep all
//           }

//           // Group by account
//           const grouped = {};
//           allTransactions.forEach(tx => {
//             if (!grouped[tx.account]) {
//               grouped[tx.account] = { account: tx.account, city: tx.city || "", debit: 0, credit: 0, opening: 0, closing: 0 };
//             }
//             if (tx.type === "debit") grouped[tx.account].debit += tx.amount;
//             if (tx.type === "credit") grouped[tx.account].credit += tx.amount;
//           });

//           // Calculate closing = opening + debit - credit
//           const rowsData = Object.values(grouped).map(r => ({
//             ...r,
//             closing: r.opening + r.debit - r.credit
//           }));

//           setRows(rowsData);
//         }
//       } catch (err) {
//         console.error("Error fetching ledger data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [show, filters]);

//   return (
//     <Modal show={show} onHide={onHide} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <div className="text-center mb-3">
//           <h5 className="fw-bold mb-1">COUSINS INDUSTRIES PVT LTD</h5>
//           <div>KUMBH ROAD, NEAR POWER GRID</div>
//           <div>MANDI GOBINDGARH</div>
//         </div>

//         <div className="d-flex justify-content-between mb-2">
//           <div>
//             <b>Balance Detail From Dated :</b>{" "}
//             {filters?.fromDate} To {filters?.uptoDate}
//           </div>
//           <div><b>Page :</b> 1</div>
//         </div>

//         {loading ? (
//           <div className="text-center">Loading...</div>
//         ) : (
//           <Table bordered size="sm" className="ledger-table">
//             <thead className="table-light">
//               <tr>
//                 <th>Account Name</th>
//                 <th>Destination</th>
//                 <th className="text-end">Opening</th>
//                 <th className="text-end">Debit</th>
//                 <th className="text-end">Credit</th>
//                 <th className="text-end">Closing</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center text-muted">No data available</td>
//                 </tr>
//               ) : (
//                 rows.map((row, idx) => (
//                   <tr key={idx}>
//                     <td>{row.account}</td>
//                     <td>{row.city || ""}</td>
//                     <td className="text-end">{row.opening.toFixed(2)}</td>
//                     <td className="text-end">{row.debit.toFixed(2)}</td>
//                     <td className="text-end">{row.credit.toFixed(2)}</td>
//                     <td className="text-end">{row.closing.toFixed(2)}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </Table>
//         )}
//       </Modal.Body>

//       <Modal.Footer className="justify-content-center">
//         <Button variant="secondary" onClick={onHide}>Close</Button>
//         <Button variant="primary" onClick={() => window.print()}>Print</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default LedgerSummaryResultModal;

import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";

const LedgerSummaryResult = ({ show, onHide, filters }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !filters) return;

    const fetchLedgerData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch transactions
        const txRes = await axios.get(
          "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile",
        );

        // 2️⃣ Fetch account details for filters
        const accountRes = await axios.get(
          "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount",
        );

        let transactions =
          txRes.data?.data?.flatMap((v) => v.transactions) || [];
        const accounts = accountRes.data?.data?.map((a) => a.formData) || [];

        // 3️⃣ Filter accounts based on parent modal selections
        let filteredAccounts = accounts.filter((a) => {
          return (
            (!filters.annexure ||
              filters.annexure === "All" ||
              a.Bsgroup === filters.annexure) &&
            (!filters.stateName || a.state === filters.stateName) &&
            (!filters.city || a.city === filters.city) &&
            (!filters.area || a.area === filters.area) &&
            (!filters.groupAgent || a.agent === filters.groupAgent)
          );
        });

        // 4️⃣ Filter transactions for these accounts
        transactions = transactions.filter((tx) =>
          filteredAccounts.some((a) => a.ahead === tx.account),
        );

        // 5️⃣ Filter by date range
        if (filters.fromDate && filters.uptoDate) {
          const from = new Date(
            filters.fromDate.split("/").reverse().join("-"),
          );
          const upto = new Date(
            filters.uptoDate.split("/").reverse().join("-"),
          );
          transactions = transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return txDate >= from && txDate <= upto;
          });
        }

        // 6️⃣ Group transactions by account
        const grouped = {};
        transactions.forEach((tx) => {
          if (!grouped[tx.account]) {
            const account = filteredAccounts.find(
              (a) => a.ahead === tx.account,
            );
            grouped[tx.account] = {
              account: tx.account,
              city: account?.city || "",
              opening:
                parseFloat(account?.opening_dr || 0) -
                parseFloat(account?.opening_cr || 0),
              debit: 0,
              credit: 0,
            };
          }
          if (tx.type === "debit") grouped[tx.account].debit += tx.amount;
          if (tx.type === "credit") grouped[tx.account].credit += tx.amount;
        });

        // 7️⃣ Calculate closing
        const finalRows = Object.values(grouped).map((r) => ({
          ...r,
          closing: r.opening + r.debit - r.credit,
        }));

        setRows(finalRows);
      } catch (err) {
        console.error("Error fetching ledger or accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, [show, filters]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      className="custom-modal"
      keyboard={true}
      style={{ marginTop: 10 }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center mb-3">
          <h5 className="fw-bold mb-1">COUSINS INDUSTRIES PVT LTD</h5>
          <div>KUMBH ROAD, NEAR POWER GRID</div>
          <div>MANDI GOBINDGARH</div>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <div>
            <b>Balance Detail From Dated :</b> {filters?.fromDate} To{" "}
            {filters?.uptoDate}
          </div>
          <div>
            <b>Page :</b> 1
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Table bordered size="sm" className="ledger-table">
            <thead >
              <tr>
                <th>Account Name</th>
                <th>City</th>
                <th className="text-end">Opening</th>
                <th className="text-end">Debit</th>
                <th className="text-end">Credit</th>
                <th className="text-end">Closing</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No data available
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.account}</td>
                    <td>{row.city}</td>
                    <td className="text-end">{row.opening.toFixed(2)}</td>
                    <td className="text-end">{row.debit.toFixed(2)}</td>
                    <td className="text-end">{row.credit.toFixed(2)}</td>
                    <td className="text-end">{row.closing.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="fw-bold">
                  <td colSpan={3} className="text-end">
                    Total
                  </td>
                  <td className="text-end">
                    {rows.reduce((a, b) => a + b.debit, 0).toFixed(2)}
                  </td>
                  <td className="text-end">
                    {rows.reduce((a, b) => a + b.credit, 0).toFixed(2)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </Table>
        )}
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          Print
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerSummaryResult;
