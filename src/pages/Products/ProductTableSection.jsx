import css from "./Product.module.css";

export default function ProductTableSection({
  rows,
  onRowClick,
  onAddProduct,
  statusClass,
  statusLabel,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className={css.tableBox}>
      <div className={css.tableHead}>
        <h3 className={css.tableTitle}>Products</h3>
        <button type="button" className={css.addBtn} onClick={onAddProduct}>
          Add Product
        </button>
      </div>

      <div className={css.tableScroll}>
        <table className={css.dataTable}>
          <thead>
            <tr>
              <th>Products</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Threshold Value</th>
              <th>Expiry Date</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p._id}
                onClick={() => onRowClick(p)}
                style={{ cursor: "pointer" }}
              >
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.quantity}</td>
                <td>{p.threshold ?? "-"}</td>
                <td>
                  {p.expiryDate
                    ? new Date(p.expiryDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className={statusClass(p)}>{statusLabel(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={css.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span className={css.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
