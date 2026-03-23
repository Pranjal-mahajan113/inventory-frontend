import css from "./Invoice.module.css";

function fmtMoney(n) {
  return Number(n || 0).toLocaleString("en-IN");
}

export default function InvoiceSummary({
  recentTransactions,
  totalInvoices,
  processedCount,
  paidAmountLast7,
  paidCountLast7,
  unpaidAmount,
  unpaidCount,
}) {
  return (
    <div className={css.summaryBox}>
      <h2 className={css.summaryHeading}>Overall Invoice</h2>
      <div className={css.summaryRow}>
        <div className={css.summaryCell}>
          <p className={css.label}>Recent Transactions</p>
          <p className={css.value}>{recentTransactions}</p>
          <p className={css.sub}>Last 7 days</p>
        </div>

        <div className={css.summaryCell}>
          <div className={css.split}>
            <div className={css.splitCol}>
              <p className={css.label}>Total Invoices</p>
              <p className={css.value}>{totalInvoices}</p>
              <p className={css.sub}>Total Till Date</p>
            </div>
            <div className={css.splitCol}>
              <p className={css.label}>Processed</p>
              <p className={css.value}>{processedCount}</p>
              <p className={css.sub}>Paid</p>
            </div>
          </div>
        </div>

        <div className={css.summaryCell}>
          <div className={css.split}>
            <div className={css.splitCol}>
              <p className={css.label}>Paid Amount</p>
              <p className={css.value}>₹ {fmtMoney(paidAmountLast7)}</p>
              <p className={css.sub}>Last 7 days</p>
            </div>
            <div className={css.splitCol}>
              <p className={css.label}>Invoices</p>
              <p className={css.value}>{paidCountLast7}</p>
              <p className={css.sub}>Paid (7 days)</p>
            </div>
          </div>
        </div>

        <div className={css.summaryCell}>
          <div className={css.split}>
            <div className={css.splitCol}>
              <p className={css.label}>Unpaid Amount</p>
              <p className={css.value}>₹ {fmtMoney(unpaidAmount)}</p>
              <p className={css.sub}>Total Pending</p>
            </div>
            <div className={css.splitCol}>
              <p className={css.label}>Customers</p>
              <p className={css.value}>{unpaidCount}</p>
              <p className={css.sub}>Unpaid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
