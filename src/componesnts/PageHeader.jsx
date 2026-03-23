import styles from "./dashboardPage.module.css";

export default function PageHeader({ title, children }) {
  return (
    <div className={styles.headerRow}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {children}
    </div>
  );
}
