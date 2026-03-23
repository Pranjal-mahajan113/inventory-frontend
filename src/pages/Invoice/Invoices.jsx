import { useEffect, useState } from "react";
import API from "../../api/axios";
import css from "./Invoice.module.css";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceTableSection from "./InvoiceTableSection";
import InvoiceBillModal from "./InvoiceBillModal";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");
  const [viewBill, setViewBill] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const close = (e) => {
      const root = document.querySelector(`[data-menu-root="${openMenuId}"]`);
      if (root && root.contains(e.target)) return;
      setOpenMenuId(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  const fetchInvoices = async () => {
    const res = await API.get("/invoices");
    setInvoices(res.data.data);
  };

  const handleMarkPaid = async (id) => {
    try {
      await API.patch(`/invoices/${id}/paid`);
      fetchInvoices();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = invoices.filter((i) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(i.invoiceId || "")
        .toLowerCase()
        .includes(q) ||
      String(
        typeof i.referenceNumber === "object"
          ? i.referenceNumber?._id
          : i.referenceNumber || ""
      )
        .toLowerCase()
        .includes(q)
    );
  });

  const now = Date.now();
  const recentTransactions = invoices.filter((i) => {
    const t = new Date(i.createdAt || i.dueDate).getTime();
    return now - t <= SEVEN_DAYS_MS;
  }).length;

  const paidList = invoices.filter((i) => i.status === "Paid");
  const unpaidList = invoices.filter((i) => i.status === "Unpaid");
  const processedCount = paidList.length;

  const paidLast7 = paidList.filter((i) => {
    const t = new Date(i.createdAt || i.dueDate).getTime();
    return now - t <= SEVEN_DAYS_MS;
  });
  const paidAmountLast7 = paidLast7.reduce(
    (a, i) => a + Number(i.amount || 0),
    0
  );
  const paidCountLast7 = paidLast7.length;

  const unpaidAmount = unpaidList.reduce(
    (a, i) => a + Number(i.amount || 0),
    0
  );
  const unpaidCount = unpaidList.length;

  return (
    <div className={css.page}>
      <div className={css.topBar}>
        <h1 className={css.pageTitle}>Invoice</h1>
        <div className={css.searchWrap}>
          <svg className={css.searchIcon} viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className={css.searchInput}
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search invoices"
          />
        </div>
      </div>

      <InvoiceSummary
        recentTransactions={recentTransactions}
        totalInvoices={invoices.length}
        processedCount={processedCount}
        paidAmountLast7={paidAmountLast7}
        paidCountLast7={paidCountLast7}
        unpaidAmount={unpaidAmount}
        unpaidCount={unpaidCount}
      />

      <InvoiceTableSection
        rows={filtered}
        openMenuId={openMenuId}
        onToggleMenu={setOpenMenuId}
        onMarkPaid={handleMarkPaid}
        onDelete={handleDelete}
        onViewInvoice={setViewBill}
      />

      {viewBill && (
        <InvoiceBillModal invoice={viewBill} onClose={() => setViewBill(null)} />
      )}
    </div>
  );
}
