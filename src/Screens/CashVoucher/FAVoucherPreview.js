// // src/components/FAVoucherPDF.js
// import React from "react";
// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// // Styles
// const styles = StyleSheet.create({
//   page: { padding: 30, fontSize: 12 },
//   section: { marginBottom: 10 },
//   header: { fontSize: 16, marginBottom: 10, textAlign: "center", textDecoration: "underline" },
//   row: { flexDirection: "row", borderBottom: 1, paddingVertical: 4 },
//   cell: { flex: 1, paddingHorizontal: 5 },
//   bold: { fontWeight: "bold" }
// });

// const FAVoucherPDF = ({ data }) => {
//   const { voucherNo, date, transactions } = data || {};

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.header}>FA Voucher View</Text>
//         <View style={styles.section}>
//           <Text>Voucher No: {voucherNo}</Text>
//           <Text>Date: {new Date(date).toLocaleDateString("en-IN")}</Text>
//         </View>

//         <View style={[styles.row, styles.bold]}>
//           <Text style={styles.cell}>ACODE</Text>
//           <Text style={styles.cell}>Account</Text>
//           <Text style={styles.cell}>Type</Text>
//           <Text style={styles.cell}>Amount</Text>
//           <Text style={styles.cell}>Narration</Text>
//         </View>

//         {transactions?.map((t, idx) => (
//           <View style={styles.row} key={idx}>
//             <Text style={styles.cell}>{t.ACODE}</Text>
//             <Text style={styles.cell}>{t.account}</Text>
//             <Text style={styles.cell}>{t.type}</Text>
//             <Text style={styles.cell}>₹{t.amount.toFixed(2)}</Text>
//             <Text style={styles.cell}>{t.narration}</Text>
//           </View>
//         ))}
//       </Page>
//     </Document>
//   );
// };

// export default FAVoucherPDF;

// components/CashVoucherPDF.js
// import React from "react";
// import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// // Styles
// const styles = StyleSheet.create({
//   page: { padding: 30, fontSize: 10 },
//   header: { textAlign: "center", marginBottom: 5 },
//   title: { fontSize: 16, fontWeight: "bold" },
//   subtitle: { fontSize: 12 },
//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 10,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     borderBottom: 1,
//     borderTop: 1,
//     paddingVertical: 4,
//     fontWeight: "bold",
//   },
//   row: {
//     flexDirection: "row",
//     paddingVertical: 2,
//     borderBottom: 0.3,
//   },
//   cellDesc: { flex: 2.5 },
//   cellAmt: { flex: 1, textAlign: "right" },
//   totalRow: {
//     flexDirection: "row",
//     borderTop: 1,
//     paddingTop: 4,
//     marginTop: 6,
//     fontWeight: "bold",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 50,
//     paddingHorizontal: 30,
//   },
// });

// const FAVoucherPDF = ({ data }) => {
//   const { voucherNo, date, transactions = [] } = data || {};

//   // Format and group transactions
//   const formatAmount = (amt) => (amt ? amt.toFixed(2) : "");

//   const totalDebit = transactions.reduce((sum, tx) => sum + (tx.type === "debit" ? tx.amount : 0), 0);
//   const totalCredit = transactions.reduce((sum, tx) => sum + (tx.type === "credit" ? tx.amount : 0), 0);

//   return (
//     <Document>
//       <Page style={styles.page} size="A4">
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>QUALITY STEELS</Text>
//           <Text style={styles.subtitle}>Mandi Gobindgarh - 147301 (Pb.)</Text>
//         </View>

//         {/* Date & Voucher type */}
//         <View style={styles.topRow}>
//           <Text>Date: {new Date(date).toLocaleDateString("en-IN")}</Text>
//           <Text>Cash Voucher</Text>
//         </View>

//         {/* Table Header */}
//         <View style={styles.tableHeader}>
//           <Text style={styles.cellDesc}>Account Name / Description</Text>
//           <Text style={styles.cellAmt}>Debit</Text>
//           <Text style={styles.cellAmt}>Credit</Text>
//         </View>

//         {/* Table Rows */}
//         {transactions.map((tx, index) => (
//           <View style={styles.row} key={index}>
//             <Text style={styles.cellDesc}>
//               {tx.account}
//               {"\n"}
//               {tx.narration}
//             </Text>
//             <Text style={styles.cellAmt}>
//               {tx.type === "debit" ? formatAmount(tx.amount) : ""}
//             </Text>
//             <Text style={styles.cellAmt}>
//               {tx.type === "credit" ? formatAmount(tx.amount) : ""}
//             </Text>
//           </View>
//         ))}

//         {/* Totals */}
//         <View style={styles.totalRow}>
//           <Text style={styles.cellDesc}>Total</Text>
//           <Text style={styles.cellAmt}>{formatAmount(totalDebit)}</Text>
//           <Text style={styles.cellAmt}>{formatAmount(totalCredit)}</Text>
//         </View>

//         {/* Footer Signatures */}
//         <View style={styles.footer}>
//           <Text>Cashier</Text>
//           <Text>Accountant</Text>
//           <Text>Manager</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default FAVoucherPDF;

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/** ---------- Helpers (JS only) ---------- */
const formatINR = (n) => {
  const num = Number(n || 0);
  // Fallback: manual Indian grouping with 2 decimals
  const parts = num.toFixed(2).split(".");
  let x = parts[0];
  const last3 = x.slice(-3);
  const other = x.slice(0, -3);
  const grouped = other ? other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return "Rs." + grouped + "." + parts[1];
};

const safeDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "");

/** ---------- Styles (React-PDF safe) ---------- */
const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, color: "#111" },

  // Header
  brandWrap: { alignItems: "center", marginBottom: 6 },
  brandTitle: { fontSize: 16, fontWeight: 700 },
  brandSub: { fontSize: 11, color: "#444", marginTop: 2 },

  // Voucher tag + rule
  voucherTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 4,
    alignItems: "center",
  },
  voucherTag: { fontSize: 12, fontWeight: 700, color: "#222", textTransform: "uppercase" },
  thinRule: { height: 1, backgroundColor: "#E3E6EB", marginBottom: 6 },

  // Meta bar (Date / Voucher No)
  metaBar: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D7DADF",
    backgroundColor: "#F7F8FA",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaRow: { flexDirection: "row" },
  pillLabel: { color: "#555", marginRight: 6 },
  pillValue: { fontWeight: 700 },

  // Table
  table: {
    borderWidth: 1,
    borderColor: "#CCD2DA",
  },
  thead: {
    flexDirection: "row",
    backgroundColor: "#EDF2F7",
    borderBottomWidth: 1,
    borderColor: "#CCD2DA",
  },
  thDesc: { flex: 66, paddingVertical: 6, paddingHorizontal: 8, fontWeight: 700 },
  thAmt: { flex: 17, paddingVertical: 6, paddingHorizontal: 8, textAlign: "right", fontWeight: 700 },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#EEF1F5",
  },
  rowAlt: { backgroundColor: "#FBFCFE" },
  tdDesc: { flex: 66, paddingVertical: 6, paddingHorizontal: 8 },
  tdAmt: { flex: 17, paddingVertical: 6, paddingHorizontal: 8, textAlign: "right" },
  acct: { fontWeight: 700, color: "#111" },
  narration: { marginTop: 2, color: "#555" },

  totalsRow: {
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
    borderTopWidth: 1,
    borderColor: "#BFC7D2",
  },
  totalsLabel: { flex: 66, paddingVertical: 8, paddingHorizontal: 8, fontWeight: 700 },
  totalsAmt: { flex: 17, paddingVertical: 8, paddingHorizontal: 8, textAlign: "right", fontWeight: 700 },

  signWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
    paddingHorizontal: 8,
  },
  signBox: { width: "30%", alignItems: "center" },
  signLine: { height: 0, borderBottomWidth: 1, borderColor: "#C9D0DA", width: "100%", marginBottom: 4 },
  signLabel: { color: "#333" },

  pageFooter: { position: "absolute", bottom: 16, left: 28, right: 28, fontSize: 9, color: "#7A7F87", textAlign: "center" },
});

/** ---------- Component (JS) ---------- */
const FAVoucherPDF = ({
  data,
  company,
  heading,
}) => {
  const comp = company || { name: "QUALITY STEELS", address: "Mandi Gobindgarh-147301 (Pb.)" };
  const title = heading || "Cash Voucher";

  const voucherNo = data && data.voucherNo;
  const date = data && data.date;
  const transactions = (data && data.transactions) || [];

  const totals = transactions.reduce(
    (acc, t) => {
      if (t && t.type === "debit") acc.debit += Number(t.amount || 0);
      if (t && t.type === "credit") acc.credit += Number(t.amount || 0);
      return acc;
    },
    { debit: 0, credit: 0 }
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Brand */}
        <View style={styles.brandWrap}>
          <Text style={styles.brandTitle}>{comp.name}</Text>
          {comp.address ? <Text style={styles.brandSub}>{comp.address}</Text> : null}
        </View>

        {/* Voucher tag & rule */}
        <View style={styles.voucherTagRow}>
          <Text style={styles.voucherTag}>{title}</Text>
        </View>
        <View style={styles.thinRule} />

        {/* Meta bar */}
        <View style={styles.metaBar}>
          <View style={styles.metaRow}>
            <Text style={styles.pillLabel}>Date:</Text>
            <Text style={styles.pillValue}>{safeDate(date)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.pillLabel}>Voucher No:</Text>
            <Text style={styles.pillValue}>{voucherNo != null ? String(voucherNo) : ""}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={styles.thDesc}>Account Name / Description</Text>
            <Text style={styles.thAmt}>Debit</Text>
            <Text style={styles.thAmt}>Credit</Text>
          </View>

          {transactions.map((tx, i) => (
            <View key={i} style={[styles.row, i % 2 ? styles.rowAlt : null]}>
              <View style={styles.tdDesc}>
                <Text style={styles.acct}>
                  {(tx && tx.account) || ""}{tx && tx.ACODE ? ` · ${tx.ACODE}` : ""}
                </Text>
                {tx && tx.narration ? <Text style={styles.narration}>• {tx.narration}</Text> : null}
              </View>
              <Text style={styles.tdAmt}>{tx && tx.type === "debit" ? formatINR(tx.amount) : ""}</Text>
              <Text style={styles.tdAmt}>{tx && tx.type === "credit" ? formatINR(tx.amount) : ""}</Text>
            </View>
          ))}

          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Total</Text>
            <Text style={styles.totalsAmt}>{formatINR(totals.debit)}</Text>
            <Text style={styles.totalsAmt}>{formatINR(totals.credit)}</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signWrap}>
          <View style={styles.signBox}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>Cashier</Text>
          </View>
          <View style={styles.signBox}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>Accountant</Text>
          </View>
          <View style={styles.signBox}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>Manager</Text>
          </View>
        </View>

        <Text style={styles.pageFooter}>
          Generated on {safeDate(new Date())} • {comp.name}
        </Text>
      </Page>
    </Document>
  );
};

export default FAVoucherPDF;
