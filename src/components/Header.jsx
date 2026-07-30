import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import LoginModal from "../components/LoginModal";

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const auth = useAuth();

  return (
    <header
      className="site-header"
      style={{
        backgroundColor: "var(--color-bg-alt)",   // ✔ mismo azul del catálogo
        padding: "10px 0"                         // ✔ sin borde inferior
      }}
    >
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

          backgroundColor: "var(--color-bg-alt)", // ✔ igual que el catálogo
          borderRadius: 10,                       // ✔ suave
          // ❌ sin borde
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
      
        {/* Candadito */}
        <button
          onClick={() => {
            if (auth.isLogged) auth.logout();
            else setShowLogin(true);
          }}
          className="admin-lock-desktop"
          style={{
            backgroundColor: "transparent",
            color: "var(--color-primary)",         // ✔ azul fuerte
            fontSize: 22,
            cursor: "pointer",
            border: "none",
            marginLeft: "auto"                     // ✔ candado a la derecha
          }}
        >
          {auth.isLogged ? "🔓" : "🔐"}
        </button>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}



