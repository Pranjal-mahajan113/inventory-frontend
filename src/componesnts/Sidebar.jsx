import { NavLink } from "react-router-dom";
import { useContext,} from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Sidebar.module.css";
import Homeimg from "../assets/Home.png"
import Productimg from "../assets/Productspage.png"
import Invoiceimg from '../assets/InvoicePage.png'

const items = [
  { to: "/dashboard", label: "Home", Icon: Homeimg},
  { to: "/products", label: "Product", Icon: Productimg },
  { to: "/invoices", label: "Invoice", Icon: Invoiceimg},
];

export default function Sidebar() {
  const { logout } = useContext(AuthContext);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Inventory</div>

      <nav className={styles.nav}>
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={styles.link}
            end={to === "/dashboard"}
          >
            <img src={Icon}alt={label} className={styles.iconImg}/>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button type="button" className={styles.logout} onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}



