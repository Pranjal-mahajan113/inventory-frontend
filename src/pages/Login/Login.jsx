import { useState, useContext } from "react";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "../Auth.module.css";
import loginHero from "../../assets/LoginImg.png";
import frameAccent from "../../assets/Frame.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await API.post("/users/login", form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.title}>Log in to your account</h2>
        <p className={styles.subtitle}>
          Welcome back! Please enter your details.
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className={styles.input}
            placeholder="Example@gmail.com"
            type="email"
            value={form.email}
            autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="login-password">Password</label>
          <div className={styles.inputWrap}>
            <input
              id="login-password"
              className={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              autoComplete="current-password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

      

        <button type="button" className={styles.button} onClick={handleLogin}>
          Sign in
        </button>

        <p className={styles.footerLink}>
          Don&apos;t you have an account?
          <Link to="/signup">Sign up</Link>
        </p>
      </div>

      <div className={styles.right} aria-hidden>
        <img src={frameAccent} alt="" className={styles.frameAccent} />
        <div className={styles.rightHeader}>
          <span className={styles.welcomeLine}>Welcome to</span>
          <span className={styles.companyName}>Company Name</span>
        </div>
        <div className={styles.heroWrap}>
          <img src={loginHero} alt="" className={styles.heroImg} />
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
