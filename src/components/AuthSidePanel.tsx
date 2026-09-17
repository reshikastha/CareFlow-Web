import BrandLogo from "./BrandLogo";
import '../styles/auth.css'

interface AuthSidePanelProps {
  title: string;
}

function AuthSidePanel({ title }: AuthSidePanelProps) {
  return (
    <aside className="auth-side-panel">
      <BrandLogo />

      <div className="side-message">
        <h2>{title}</h2>
        <p>People care. Work flows.</p>
      </div>

      <div className="plant-decoration" aria-hidden="true">
        <div className="background-wave wave-one" />
        <div className="background-wave wave-two" />

        <div className="plant-heart">
          <span className="heart-left" />
          <span className="heart-right" />
          <span className="heart-line" />
        </div>

        <span className="plant-stem stem-left" />
        <span className="plant-stem stem-right" />

        <span className="plant-leaf leaf-one" />
        <span className="plant-leaf leaf-two" />
        <span className="plant-leaf leaf-three" />
        <span className="plant-leaf leaf-four" />
      </div>
    </aside>
  );
}

export default AuthSidePanel;