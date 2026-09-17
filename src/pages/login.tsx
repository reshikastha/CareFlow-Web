import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

import AuthSidePanel from "../components/AuthSidePanel";
import PasswordInput from "../components/PasswordInput";
import '../styles/auth.css'

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [message, setMessage] = useState("");

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Login details:", formData);

    setMessage("Login form submitted successfully.");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <AuthSidePanel title="Better care today for a brighter tomorrow." />

        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <header className="form-header">
              <h1>Welcome back</h1>
              <p>Sign in to your CareFlow account</p>
            </header>

            <label className="form-field" htmlFor="login-email">
              <span className="field-label">
                Email address
              </span>

              <span className="input-container">
                <Mail size={19} />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <PasswordInput
              id="login-password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />

                <span>Remember me</span>
              </label>

              <button
                className="text-button"
                type="button"
                onClick={() =>
                  alert("Connect this button to your reset-password page.")
                }
              >
                Forgot password?
              </button>
            </div>

            <button className="primary-button" type="submit">
              Sign in
            </button>

            {message && (
              <p className="form-message">{message}</p>
            )}

            <div className="form-divider">
              <span>New to CareFlow?</span>

              <Link to="/register">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;