import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";

export default function GstRegister({ show, onClose }) {
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [sale, setSale] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ purchase: {}, sale: {}, closing: {} });

  useEffect(() => {
    if (show) {
      fetchSale();
      fetchPurchase();
    }
  }, [show]);

  const fetchSale = async () => {
    try {
      const res = await axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale");
      setSale(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPurchase = async () => {
    try {
      const res = await axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase");
      setPurchase(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (sale.length || purchase.length) buildRegister();
  }, [sale, purchase]);

  const buildRegister = () => {
    let sr = 1;
    let table = [];

    // Purchase rows
    purchase.forEach((p) => {
      table.push({
        sr: sr++,
        date: p.date,
        bill: p.vno,
        purchase: {
          cgst: p.cgstAmnt || 0,
          sgst: p.sgstAmnt || 0,
          igst: p.igstAmnt || 0,
          cess: p.cessAmnt || 0,
        },
        sale: {},
      });
    });

    // Sale rows
    sale.forEach((s) => {
      table.push({
        sr: sr++,
        date: s.date,
        bill: s.vno,
        purchase: {},
        sale: {
          cgst: s.ctax || 0,
          sgst: s.stax || 0,
          igst: s.itax || 0,
          cess: s.cess || 0,
        },
      });
    });

    // Summary totals
    const purchaseSum = {
      cgst: purchase.reduce((a, b) => a + (b.cgstAmnt || 0), 0),
      sgst: purchase.reduce((a, b) => a + (b.sgstAmnt || 0), 0),
      igst: purchase.reduce((a, b) => a + (b.igstAmnt || 0), 0),
      cess: purchase.reduce((a, b) => a + (b.cessAmnt || 0), 0),
    };

    const saleSum = {
      cgst: sale.reduce((a, b) => a + (b.ctax || 0), 0),
      sgst: sale.reduce((a, b) => a + (b.stax || 0), 0),
      igst: sale.reduce((a, b) => a + (b.itax || 0), 0),
      cess: sale.reduce((a, b) => a + (b.cess || 0), 0),
    };

    const closing = {
      cgst: purchaseSum.cgst - saleSum.cgst,
      sgst: purchaseSum.sgst - saleSum.sgst,
      igst: purchaseSum.igst - saleSum.igst,
      cess: purchaseSum.cess - saleSum.cess,
    };

    setRows(table);
    setSummary({ purchase: purchaseSum, sale: saleSum, closing });
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" backdrop="static">
      <div className="p-3 bg-light" style={{ minHeight: "90vh" }}>
        <h4 className="text-center fw-bold">GST REGISTER</h4>

        {/* Filters */}
        <div className="d-flex gap-3 my-3">
          <div>
            <label>From:</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <label>To:</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <table className="table table-bordered text-center small">
          <thead>
            <tr>
              <th rowSpan="2">Sr</th>
              <th rowSpan="2">Date</th>
              <th rowSpan="2">B.No</th>
              <th colSpan="4">GST Purchase</th>
              <th colSpan="4">GST Sale</th>
            </tr>
            <tr>
              <th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th>
              <th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sr}>
                <td>{r.sr}</td>
                <td>{r.date}</td>
                <td>{r.bill}</td>
                {/* Purchase */}
                <td>{r.purchase.cgst || ""}</td>
                <td>{r.purchase.sgst || ""}</td>
                <td>{r.purchase.igst || ""}</td>
                <td>{r.purchase.cess || ""}</td>
                {/* Sale */}
                <td>{r.sale.cgst || ""}</td>
                <td>{r.sale.sgst || ""}</td>
                <td>{r.sale.igst || ""}</td>
                <td>{r.sale.cess || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-4">
          <h5>Summary</h5>
          <table className="table table-bordered text-center small">
            <thead>
              <tr>
                <th></th><th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GST Purchase</td>
                <td>{summary.purchase.cgst}</td>
                <td>{summary.purchase.sgst}</td>
                <td>{summary.purchase.igst}</td>
                <td>{summary.purchase.cess}</td>
                <td>{summary.purchase.cgst + summary.purchase.sgst + summary.purchase.igst + summary.purchase.cess}</td>
              </tr>
              <tr>
                <td>GST Sale</td>
                <td>{summary.sale.cgst}</td>
                <td>{summary.sale.sgst}</td>
                <td>{summary.sale.igst}</td>
                <td>{summary.sale.cess}</td>
                <td>{summary.sale.cgst + summary.sale.sgst + summary.sale.igst + summary.sale.cess}</td>
              </tr>
              <tr>
                <td>Closing Balance</td>
                <td>{summary.closing.cgst}</td>
                <td>{summary.closing.sgst}</td>
                <td>{summary.closing.igst}</td>
                <td>{summary.closing.cess}</td>
                <td>{summary.closing.cgst + summary.closing.sgst + summary.closing.igst + summary.closing.cess}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}
