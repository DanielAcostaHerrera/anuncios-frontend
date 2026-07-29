import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import LoginModal from "../components/LoginModal";

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const auth = useAuth();

  return (
    <header className="site-header">
      <div
        className="header-container"
        style={{
          width: "100%",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div className="logo-box">
          <NavLink to="/" style={{ display: "inline-block" }}>
            <img
              src="/logo.png"
              alt="Ventas, Rentas, Habana"
              className="logo-img"
              style={{ height: "60px", cursor: "pointer" }}
            />
          </NavLink>
        </div>

        {/* Nombre del negocio */}
        <div className="title-box">
          <span
            className="header-title"
            style={{
              fontWeight: 600,
              color: "#f0f0f0",
              whiteSpace: "nowrap",
            }}
          >
            Ventas, Rentas, Habana
          </span>
        </div>

        {/* Candadito */}
        <button
          onClick={() => {
            if (auth.isLogged) auth.logout();
            else setShowLogin(true);
          }}
          className="admin-lock-desktop"
        >
          {auth.isLogged ? "🔓" : "🔐"}
        </button>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}
