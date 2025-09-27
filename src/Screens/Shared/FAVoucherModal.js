import React, { useEffect, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import useCompanySetup from "../Shared/useCompanySetup";

// common modal style
const modalSx = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "950px",
  maxWidth: "96vw",
  maxHeight: "88vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

// helpers
const fmtINR = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => {
  try {
    const dt = new Date(d);
    return isNaN(dt) ? "" : dt.toLocaleDateString("en-IN");
  } catch {
    return "";
  }
};

// map vtype -> apipath + title + posting text
const CONFIG = {
  P: { apipath: "purchasefaFile", header: "FA VOUCHER (PURCHASE)", posting: "Purchase FA Entries" },
  S: { apipath: "salefafile",     header: "FA VOUCHER (SALE)",     posting: "Sale FA Entries" },
  B: { apipath: "bankfafile",     header: "FA VOUCHER (BANK)",     posting: "Bank FA Entries" },
  C: { apipath: "cashfafile",     header: "FA VOUCHER (CASH)",     posting: "Cash FA Entries" },
};

export default function FAVoucherModal({
  open,
  onClose,
  tenant,
  voucherno,
  vtype = "P", // default Purchase
}) {
  const [loading, setLoading] = useState(false);
  const [fa, setFa] = useState(null);
  const [error, setError] = useState("");

  const { companyName, companyAdd, companyCity, cPin } = useCompanySetup();

  const cfg = CONFIG[vtype] || CONFIG.P;

  useEffect(() => {
    if (!open || !tenant || !voucherno) return;
    const run = async () => {
      setLoading(true);
      setError("");
      setFa(null);
      try {
        const url = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/${cfg.apipath}/byVoucher?vtype=${encodeURIComponent(
          vtype
        )}&voucherno=${encodeURIComponent(voucherno)}&rebuild=0&save=0`;
        const res = await axios.get(url);
        setFa(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || "Unable to load FA voucher.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, tenant, voucherno, vtype]);

  const totals = useMemo(() => {
    const tx = fa?.transactions || [];
    const debit = tx.reduce(
      (s, t) => s + (t.type === "debit" ? Number(t.amount) || 0 : 0),
      0
    );
    const credit = tx.reduce(
      (s, t) => s + (t.type === "credit" ? Number(t.amount) || 0 : 0),
      0
    );
    const diff = debit - credit;
    return { debit, credit, diff, balanced: Math.abs(diff) < 0.005 };
  }, [fa]);

  // print just preview
  const handlePrint = () => {
    const preview = document.getElementById("fa-preview");
    if (!preview) return;
    const css = getScopedCss(); // same CSS for print
    const html = `
    <!doctype html>
    <html>
    <head>
    <meta charset="utf-8"/>
    <title>${cfg.header} - ${voucherno}</title>
    <style>
        @page { size: A4; margin: 14mm; }
        ${css}
    </style>
    </head>
    <body>
    ${preview.innerHTML}
    </body>
    </html>`;
    const w = window.open("", "_blank");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 250);
  };

  // scoped CSS (common for all types)
  const getScopedCss = () => `
    #fa-preview * { box-sizing:border-box; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    #fa-preview .wrap { width:100%; background:#fff; }
    #fa-preview .topbar {
      display:flex; justify-content:space-between; align-items:center;
      border:1px solid #e5e7eb; border-radius:12px; padding:12px 16px; background: linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);
      margin-bottom:12px;
    }
    #fa-preview .brand-block { text-align:left; }
    #fa-preview .brand { font-size:20px; font-weight:800; letter-spacing:.3px; }
    #fa-preview .sub { font-size:12px; color:#475569; }
    #fa-preview .heads { text-align:right; font-size:12px; color:#374151; }
    #fa-preview .badge {
      display:inline-block; background:#ecfeff; color:#0e7490; border:1px solid #99f6e4;
      padding:4px 10px; border-radius:999px; font-weight:700; margin-left:8px;
    }
    #fa-preview .meta {
      display:flex; justify-content:space-between; gap:16px; margin:10px 0 14px;
    }
    #fa-preview .meta .box {
      flex:1; border:1px dashed #cbd5e1; border-radius:10px; padding:10px 12px; font-size:12px; color:#1f2937; background:#f8fafc;
    }
    #fa-preview .meta .box strong { color:#111827; }

    #fa-preview table { width:100%; border-collapse:collapse; }
    #fa-preview thead th {
      position:sticky; top:0;
      background:#0ea5e9; color:#fff; font-weight:800; font-size:12px;
      padding:10px; border:1px solid #89cff0;
    }
    #fa-preview tbody td {
      border:1px solid #e5e7eb; padding:8px 10px; font-size:12px; vertical-align:top;
    }
    #fa-preview tbody tr:nth-child(odd) { background:#fafafa; }
    #fa-preview .desc { width:60%; }
    #fa-preview .num  { text-align:right; width:20%; white-space:nowrap; }

    #fa-preview tfoot td {
      border:1px solid #cbd5e1; padding:10px; font-weight:800; font-size:12px; background:#f1f5f9;
    }
    #fa-preview .totals-bar {
      display:flex; gap:12px; margin-top:10px;
    }
    #fa-preview .totcard {
      flex:1; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; background:#ffffff;
      display:flex; align-items:center; justify-content:space-between; font-size:13px;
    }
    #fa-preview .status {
      font-size:12px; font-weight:800; padding:4px 10px; border-radius:999px; border:1px solid;
    }
    #fa-preview .ok { background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
    #fa-preview .bad { background:#fef2f2; color:#991b1b; border-color:#fecaca; }

    #fa-preview .signs { display:flex; justify-content:space-between; margin-top:36px; font-size:12px; color:#6b7280; }
    #fa-preview .line { min-width:28%; text-align:center; }
  `;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalSx}>
        {/* Header / Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ fontWeight: 800, fontSize: 18, letterSpacing: ".3px" }}>
            {cfg.header}
          </Box>
          <Box>
            <Button variant="contained" onClick={handlePrint} sx={{ mr: 1 }}>
              PRINT
            </Button>
            <Button variant="outlined" onClick={onClose}>
              CLOSE
            </Button>
          </Box>
        </Box>

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 1,
            p: 2,
            background: "#f8fafc",
          }}
        >
          {/* on-screen CSS */}
          <style>{getScopedCss()}</style>

          {loading && (
            <Box
              sx={{
                height: 240,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Box sx={{ color: "crimson", fontSize: 14 }}>{error}</Box>
          )}

          {!loading && !error && fa && (
            <div id="fa-preview" className="wrap">
              {/* Top ribbon */}
              <div className="topbar">
                <div className="brand-block">
                  <div className="brand">{companyName?.toUpperCase()}</div>
                  <div className="sub">{companyAdd}</div>
                  <div className="sub">
                    {companyCity}-{cPin}
                  </div>
                </div>
                <div>
                  <div>
                    <strong>Voucher No:</strong> {fa.voucherNo}
                  </div>
                  <div>
                    <strong>Date:</strong> {fmtDate(fa.date)}
                  </div>
                  <div>
                    <strong>Type:</strong>{" "}
                    <span className="badge">{fa.vtype || vtype}</span>
                  </div>
                </div>
              </div>

              {/* quick meta */}
              <div className="meta">
                <div className="box">
                  <strong>Voucher</strong>
                  <div>No. {fa.voucherNo}</div>
                </div>
                <div className="box">
                  <strong>Posting</strong>
                  <div>{cfg.posting}</div>
                </div>
                <div className="box">
                  <strong>Status</strong>
                  <div>{totals.balanced ? "Balanced" : "Not balanced"}</div>
                </div>
              </div>

              {/* Table */}
              <table>
                <thead>
                  <tr>
                    <th className="desc">Account / Narration</th>
                    <th className="num">Debit</th>
                    <th className="num">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {(fa.transactions || []).map((t) => (
                    <tr key={t._id || `${t.account}-${t.type}-${t.amount}`}>
                      <td className="desc">
                        <div style={{ fontWeight: 700 }}>{t.account}</div>
                        <div style={{ color: "#6b7280" }}>{t.narration}</div>
                        {(t.CGST || t.SGST || t.IGST) && (
                          <div style={{ marginTop: 4, color: "#64748b" }}>
                            {t.CGST ? `CGST: ${fmtINR(t.CGST)}  ` : ""}
                            {t.SGST ? `SGST: ${fmtINR(t.SGST)}  ` : ""}
                            {t.IGST ? `IGST: ${fmtINR(t.IGST)}` : ""}
                          </div>
                        )}
                      </td>
                      <td className="num">
                        {t.type === "debit" ? fmtINR(t.amount) : ""}
                      </td>
                      <td className="num">
                        {t.type === "credit" ? fmtINR(t.amount) : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td className="num">{fmtINR(totals.debit)}</td>
                    <td className="num">{fmtINR(totals.credit)}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Totals / balance strip */}
              <div className="totals-bar">
                <div className="totcard">
                  <div>
                    <strong>Debit Total</strong>
                  </div>
                  <div>{fmtINR(totals.debit)}</div>
                </div>
                <div className="totcard">
                  <div>
                    <strong>Credit Total</strong>
                  </div>
                  <div>{fmtINR(totals.credit)}</div>
                </div>
                <div className="totcard">
                  <div>
                    <strong>Difference</strong>
                  </div>
                  <div>{fmtINR(totals.diff)}</div>
                </div>
                <div
                  className="totcard"
                  style={{ flex: "0 0 180px", justifyContent: "center" }}
                >
                  <span className={`status ${totals.balanced ? "ok" : "bad"}`}>
                    {totals.balanced ? "BALANCED" : "NOT BALANCED"}
                  </span>
                </div>
              </div>

              {/* Footer signatures */}
              <div className="signs">
                <div className="line">Prepared By</div>
                <div className="line">Accountant</div>
                <div className="line">Authorised Signatory</div>
              </div>
            </div>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
