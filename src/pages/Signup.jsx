import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Auth.module.css";
import signupHero from "../assets/otptype.png";
import frameAccent from "../assets/Frame.png";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await API.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.subtitle}>Start inventory management.</p>

        <div className={styles.formGroup}>
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            className={styles.input}
            placeholder="Full name"
            value={form.name}
            autoComplete="name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            className={styles.input}
            placeholder="Example@gmail.com"
            type="email"
            value={form.email}
            autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signup-password">Create Password</label>
          <div className={styles.inputWrap}>
            <input
              id="signup-password"
              className={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="at least 8 characters"
              value={form.password}
              autoComplete="new-password"
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

        <div className={styles.formGroup}>
          <label htmlFor="signup-confirm">Confirm Password</label>
          <div className={styles.inputWrap}>
            <input
              id="signup-confirm"
              className={styles.input}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirmPassword}
              autoComplete="new-password"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="button" className={styles.button} onClick={handleSignup}>
          Sign up
        </button>

        <p className={styles.footerLink}>
          Do you have an account?
          <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className={styles.right} aria-hidden>
        <img src={frameAccent} alt="" className={styles.frameAccent} />
        <div className={styles.rightHeader}>
          <span className={styles.welcomeLine}>Welcome to</span>
          <span className={styles.companyName}>Company Name</span>
        </div>
        <div className={styles.heroWrap}>
          <img src={signupHero} alt="" className={styles.heroImg} />
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
