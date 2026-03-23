import css from "./Invoice.module.css";

function refLabel(ref) {
  if (ref == null) return "—";
  if (typeof ref === "object" && ref._id) return String(ref._id);
  return String(ref);
}

export default function InvoiceBillModal({ invoice, onClose }) {
  if (!invoice) return null;

  const due = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
    : "—";

  return (
    <div
      className={css.billBackdrop}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={css.billPanel}
        role="dialog"
        aria-labelledby="bill-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={css.billHeader}>
          <h2 id="bill-title" className={css.billBrand}>
            Invoice
          </h2>
          <p className={css.billSub}>{invoice.invoiceId}</p>
        </div>

        <div className={css.billRow}>
          <span>Reference</span>
          <strong>{refLabel(invoice.referenceNumber)}</strong>
        </div>
        <div className={css.billRow}>
          <span>Quantity</span>
          <strong>{invoice.quantity}</strong>
        </div>
        <div className={css.billRow}>
          <span>Status</span>
          <strong>{invoice.status}</strong>
        </div>
        <div className={css.billRow}>
          <span>Due date</span>
          <strong>{due}</strong>
        </div>

        <div className={css.billTotal}>
          <span>Amount</span>
          <span>₹ {Number(invoice.amount || 0).toLocaleString("en-IN")}</span>
        </div>

        <button type="button" className={css.billClose} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
