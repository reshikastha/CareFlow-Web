import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { Mail } from "lucide-react";
import { Link, useNavigate} from "react-router-dom";

import AuthSidePanel from "../components/AuthSidePanel";
import PasswordInput from "../components/PasswordInput";
import '../styles/auth.css'
import { loginUser } from "../services/authApi";

interface LoginFormData {
  email: string;
  password: string;
 
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });


    const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
      const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
        [name]: value,
    }));
  }

 const handleLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    try {
      setIsLoading(true);

      const response = await loginUser(formData);

      // Send users to different dashboards based on role.
      if (response.user.role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/carer/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <AuthSidePanel title="Better care today for a brighter tomorrow." />

        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleLogin}>
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


            {error && <p className="error-message">{error}</p>}

            <button className="primary-button" type="submit" disabled={isLoading}>
               {isLoading ? "Logging in..." : "Login"}
            </button>

           

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