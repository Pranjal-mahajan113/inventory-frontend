import { useState, useEffect } from "react";
import API from "../../api/axios";
import css from "./Product.module.css";
import ProductInventorySummary from "./ProductInventorySummary";
import ProductTableSection from "./ProductTableSection";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [form, setForm] = useState({
    name: "",
    productId: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    threshold: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching products");
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!form.name || !form.productId || !form.price || !form.quantity) {
        return alert("Please fill required fields");
      }

      await API.post("/products", form);

      setShowForm(false);

      setForm({
        name: "",
        productId: "",
        category: "",
        price: "",
        quantity: "",
        unit: "",
        expiryDate: "",
        threshold: "",
        image: "",
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding product");
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleBuyNow = async () => {
    if (quantity <= 0) {
      return alert("Enter valid quantity");
    }

    if (quantity > selectedProduct.quantity) {
      return alert("Not enough stock");
    }

    try {
      await API.post("/invoices", {
        productId: selectedProduct._id,
        quantity,
      });

      alert("Invoice Created ✅");

      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const lowCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= (p.threshold || 0),
  ).length;
  const notInStockCount = products.filter((p) => p.quantity <= 0).length;

  let stockValue = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    stockValue += Number(p.price || 0) * Number(p.quantity || 0);
  }

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.trim().toLowerCase()),
  );
  //-------
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedRows = filtered.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const statusClass = (p) => {
    const th = p.threshold || 0;
    if (p.quantity <= 0) return css.outStock;
    if (p.quantity <= th) return css.lowStock;
    return css.inStock;
  };

  const statusLabel = (p) => {
    const th = p.threshold || 0;
    if (p.quantity <= 0) return "Out of stock";
    if (p.quantity <= th) return "Low stock";
    return "In-stock";
  };

  return (
    <div className={css.page}>
      <div className={css.topBar}>
        <h1 className={css.pageTitle}>Product</h1>
        <div className={css.searchWrap}>
          <svg className={css.searchIcon} viewBox="0 0 24 24" fill="none">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 20l-3-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            className={css.searchInput}
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>
      </div>

      <ProductInventorySummary
        totalProducts={products.length}
        lowStockCount={lowCount}
        notInStockCount={notInStockCount}
        stockValue={stockValue.toLocaleString("en-IN")}
      />

      <ProductTableSection
        rows={paginatedRows}
        onRowClick={handleRowClick}
        onAddProduct={() => setShowForm(true)}
        statusClass={statusClass}
        statusLabel={statusLabel}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {showForm && (
        <div
          className={css.modalBackdrop}
          role="presentation"
          onClick={() => setShowForm(false)}
        >
          <div
            className={css.modalPanel}
            role="dialog"
            aria-labelledby="modal-add-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-add-title" className={css.modalTitle}>
              Add Product
            </h2>
            <p className={css.modalSub}>
              Enter the details for the new product.
            </p>

            <div className={css.modalForm}>
              <input
                className={css.modalInput}
                placeholder="Product Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className={css.modalInput}
                placeholder="Product ID *"
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
              />
              <input
                className={css.modalInput}
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                className={css.modalInput}
                placeholder="Price *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                className={css.modalInput}
                placeholder="Quantity *"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
              <input
                className={css.modalInput}
                placeholder="Unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
              <input
                className={css.modalInput}
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
              />
              <input
                className={css.modalInput}
                placeholder="Threshold"
                value={form.threshold}
                onChange={(e) =>
                  setForm({ ...form, threshold: e.target.value })
                }
              />
            </div>

            <div className={css.modalActions}>
              <button
                type="button"
                className={css.btnGhost}
                onClick={() => setShowForm(false)}
              >
                Discard
              </button>
              <button
                type="button"
                className={css.btnDark}
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className={css.modalBackdrop}
          role="presentation"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className={css.modalPanel}
            role="dialog"
            aria-labelledby="modal-buy-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-buy-title" className={css.modalTitle}>
              {selectedProduct.name}
            </h2>
            <p className={css.modalSub}>Create invoice for this product.</p>

            <p className={css.modalMeta}>
              Price: <strong>₹{selectedProduct.price}</strong> · Available:{" "}
              <strong>{selectedProduct.quantity}</strong>
            </p>

            <div className={css.modalForm}>
              <input
                className={css.modalInput}
                type="number"
                min="1"
                max={selectedProduct.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                aria-label="Quantity"
              />
            </div>

            <div className={css.modalActions}>
              <button
                type="button"
                className={css.btnGhost}
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={css.btnDark}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
