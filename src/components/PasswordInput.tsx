import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import {
  type InputHTMLAttributes,
  useState,
} from "react";

import '../styles/auth.css'

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function PasswordInput({
  label,
  id,
  ...inputProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="form-field" htmlFor={id}>
      <span className="field-label">{label}</span>

      <span className="input-container">
        <LockKeyhole size={19} />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          {...inputProps}
        />

        <button
          className="password-button"
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </span>
    </label>
  );
}

export default PasswordInput;