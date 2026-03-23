import PageHeader from "../componesnts/PageHeader";
import dash from "../componesnts/dashboardPage.module.css";

export default function Settings() {
  return (
    <div className={dash.wrap}>
      <PageHeader title="Setting" />
      <div className={dash.card}>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9375rem" }}>
         Setting
        </p>
      </div>
    </div>
  );
}
