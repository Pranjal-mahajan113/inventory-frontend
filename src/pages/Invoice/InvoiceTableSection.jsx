import css from "./Invoice.module.css";

function refDisplay(ref) {
  if (ref == null) return "—";
  if (typeof ref === "object" && ref._id) return String(ref._id);
  return String(ref);
}

function formatDue(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export default function InvoiceTableSection({
  rows,
  openMenuId,
  onToggleMenu,
  onMarkPaid,
  onDelete,
  onViewInvoice,
}) {
  return (
    <div className={css.tableBox}>
      <div className={css.tableHead}>
        <h3 className={css.tableTitle}>Invoices List</h3>
      </div>

      <div className={css.tableScroll}>
        <table className={css.dataTable}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Reference Number</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i._id}>
                <td>{i.invoiceId}</td>
                <td>{refDisplay(i.referenceNumber)}</td>
                <td>₹ {Number(i.amount || 0).toLocaleString("en-IN")}</td>
                <td>
                  <span
                    className={
                      i.status === "Paid" ? css.statusPaid : css.statusUnpaid
                    }
                  >
                    {i.status}
                  </span>
                </td>
                <td>
                  <div
                    className={css.dateCell}
                    data-menu-root={i._id}
                  >
                    <span>{formatDue(i.dueDate)}</span>
                    <div className={css.menuWrap}>
                      <button
                        type="button"
                        className={css.menuBtn}
                        aria-expanded={openMenuId === i._id}
                        aria-label="Open menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMenu(openMenuId === i._id ? null : i._id);
                        }}
                      >
                        ⋮
                      </button>

                      {openMenuId === i._id && (
                        <div className={css.dropdown}>
                          <div className={css.dropdownStatus}>
                            {i.status === "Paid" ? (
                              <span className={css.statusPillPaid}>Paid</span>
                            ) : (
                              <span className={css.statusPillUnpaid}>Unpaid</span>
                            )}
                          </div>

                          {i.status === "Unpaid" && (
                            <button
                              type="button"
                              className={css.menuItem}
                              onClick={() => {
                                onMarkPaid(i._id);
                                onToggleMenu(null);
                              }}
                            >
                              Mark as Paid
                            </button>
                          )}

                          <button
                            type="button"
                            className={css.menuItem}
                            onClick={() => {
                              onViewInvoice(i);
                              onToggleMenu(null);
                            }}
                          >
                            View Invoice
                          </button>

                          <button
                            type="button"
                            className={`${css.menuItem} ${css.menuItemDanger}`}
                            disabled={i.status !== "Paid"}
                            onClick={() => {
                              if (i.status !== "Paid") return;
                              onDelete(i._id);
                              onToggleMenu(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={css.pagination}>
        <button type="button">Previous</button>
        <span className={css.pageInfo}>Page 1 of 10</span>
        <button type="button">Next</button>
      </div>
    </div>
  );
}
