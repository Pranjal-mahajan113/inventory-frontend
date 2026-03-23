import css from "./Product.module.css";

/**
 * Top summary row — categories & top selling hardcoded (design),
 * total products & low stock from API counts passed in.
 */
export default function ProductInventorySummary({
  totalProducts,
  lowStockCount,
  notInStockCount,
  stockValue,
}) {
  return (
    <div className={css.inventoryBox}>
      <h2 className={css.inventoryHeading}>Overall Inventory</h2>
      <div className={css.inventoryRow}>
        <div className={css.inventoryCell}>
          <p className={css.inventoryLabel}>Categories</p>
          <p className={css.inventoryValue}>14</p>
        </div>
        <div className={css.inventoryCell}>
          <p className={css.inventoryLabel}>Total Products</p>
          <p className={css.inventoryValue}>{totalProducts}</p>
          <p className={css.inventorySubMoney}>₹ {stockValue}</p>
        </div>
        <div className={css.inventoryCell}>
          <p className={css.inventoryLabel}>Top Selling</p>
          <p className={css.inventoryValue}>6</p>
          <p className={css.inventorySubMoney}>Revenue ₹ 2,500</p>
        </div>
        <div className={css.inventoryCell}>
          <p className={css.inventoryLabel}>Low Stocks</p>
          <p className={css.inventoryValue}>{lowStockCount}</p>
          <p className={css.inventorySub}>Low Stock</p>
          <p className={css.inventorySubMoney}>{notInStockCount} Not in stock</p>
        </div>
      </div>
    </div>
  );
}
