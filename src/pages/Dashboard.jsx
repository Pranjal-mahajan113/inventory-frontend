import { useEffect, useState } from "react";
import API from "../api/axios";
import PageHeader from "../componesnts/PageHeader";
import styles from "../componesnts/dashboardPage.module.css";
import Revenue from "../assets/Revenue.png";
import Sales from "../assets/Sales.png";
import Invoice from "../assets/Purchase.png";
import Stock from "../assets/in stock.png";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [invRes, prodRes] = await Promise.all([
          API.get("/invoices"),
          API.get("/products"),
        ]);
        if (!cancelled) {
          setInvoices(invRes.data.data || []);
          setProducts(prodRes.data.data || []);
        }
      } catch {
        if (!cancelled) {
          setInvoices([]);
          setProducts([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ================= CALCULATIONS =================
  const paid = invoices.filter((i) => i.status === "Paid");

  const totalRevenue = paid.reduce((a, i) => a + (Number(i.amount) || 0), 0);

  const lowStock = products.filter(
    (p) => p.quantity <= (p.threshold || 0),
  ).length;

  const categoryCount = new Set(products.map((p) => p.category).filter(Boolean))
    .size;

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(n);

  // ================= CHART =================
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Purchase",
        data: [45, 52, 38, 60, 48, 55],
        backgroundColor: "#3b82f6",
      },
      {
        label: "Sales",
        data: [62, 48, 70, 55, 72, 65],
        backgroundColor: "#22c55e",
      },
    ],
  };

  // ================= TOP PRODUCTS =================
  const topProducts = invoices
    .map((inv) => {
      const p = products.find((x) => x._id === inv.productId);
      return p?.name;
    })
    .filter(Boolean);

  return (
    <div className={styles.wrap}>
      <PageHeader title="Home" />

      {/* ================= TOP METRICS ================= */}
      <div className={styles.metricsStrip}>
        <div className={styles.metricTile}>
          <div className={styles.metricIcon}>
            <img src={Revenue} alt="" />
          </div>
          <div className={styles.metricBody}>
            <p>Total Revenue</p>
            <strong>₹ {fmt(totalRevenue)}</strong>
          </div>
        </div>

        <div className={styles.metricTile}>
          <div className={styles.metricIcon}>
            <img src={Sales} alt="" />
          </div>
          <div className={styles.metricBody}>
            <p>Products</p>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className={styles.metricTile}>
          <div className={styles.metricIcon}>
            <img src={Invoice} alt="" />
          </div>
          <div className={styles.metricBody}>
            <p>Invoices</p>
            <strong>{invoices.length}</strong>
          </div>
        </div>

        <div className={styles.metricTile}>
          <div className={styles.metricIcon}>
            <img src={Stock} alt="SrockImg" />
          </div>
          <div className={styles.metricBody}>
            <p>Low stock</p>
            <strong>{lowStock}</strong>
          </div>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className={styles.summaryRow}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Inventory summary</h3>
          <div className={styles.summaryRow}>
            <div className={styles.summaryItem}>
              <p>In stock (qty)</p>
              <h3>
                {products.reduce((a, p) => a + (Number(p.quantity) || 0), 0)}
              </h3>
            </div>
            <div className={styles.summaryItem}>
              <p>Categories</p>
              <h3>{categoryCount}</h3>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Orders snapshot</h3>
          <div className={styles.summaryRow}>
            <div className={styles.summaryItem}>
              <p>Paid invoices</p>
              <h3>{paid.length}</h3>
            </div>
            <div className={styles.summaryItem}>
              <p>Unpaid</p>
              <h3>{invoices.filter((i) => i.status === "Unpaid").length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHART + TOP PRODUCTS ================= */}
      <div className={styles.grid2}>
        {/* CHART */}
        <div className={styles.card}>
          <div className={styles.chartHeader}>
            <h3 className={styles.cardTitle}>Sales & Purchase</h3>
          </div>

          <div style={{ height: "250px" }}>
            <Bar data={chartData} />
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Top Products</h3>

          <ul className={styles.topList}>
            {topProducts.map((name, i) => (
              <li key={i}>
                <span>{name}</span>

                <div className={styles.topBarVisual}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`${styles.topSeg} ${n <= 3 ? styles.on : ""}`}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
