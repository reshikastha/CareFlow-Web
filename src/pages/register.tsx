import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import {
  Mail,
  UserRound,
} from "lucide-react";

import { Link ,useNavigate } from "react-router-dom";

import AuthSidePanel from "../components/AuthSidePanel";
import PasswordInput from "../components/PasswordInput";
import '../styles/auth.css'
import { registerUser } from "../services/authApi";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  
}

function Register() {
 const navigate = useNavigate();

  const [formData, setFormData] =
    useState<RegisterFormData>({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      
    });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

   try {
      setIsLoading(true);

      const response = await registerUser(formData);

      setMessage(response.message);

      // Go to login after successful registration.
      navigate("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card register-card">
        <AuthSidePanel title="A healthier tomorrow starts together." />

        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <header className="form-header">
              <h1>Create your account</h1>
              <p>Join CareFlow and make a difference</p>
            </header>

            <label
              className="form-field"
              htmlFor="full-name"
            >
              <span className="field-label">
                Full name
              </span>

              <span className="input-container">
                <UserRound size={19} />

                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </span>
            </label>

            <label
              className="form-field"
              htmlFor="register-email"
            >
              <span className="field-label">
                Email address
              </span>

              <span className="input-container">
                <Mail size={19} />

                <input
                  id="register-email"
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
              id="register-password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              label="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              minLength={8}
              required
            />

           

            <button className="primary-button" type="submit" disabled={isLoading}>
                 {isLoading ? "Creating account..." : "Register"}
            </button>

            {error && (
              <p className="form-message error-message">
                {error}
              </p>
            )}

            {message && (
              <p className="form-message">{message}</p>
            )}

            <div className="form-divider">
              <span>Already have an account?</span>

              <Link to="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;