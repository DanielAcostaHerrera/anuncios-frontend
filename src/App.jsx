import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

/* 🔹 ANUNCIOS */
import AnuncioDetalles from "./pages/AnuncioDetalles";
import EditarAnuncio from "./pages/EditarAnuncio";
import InsertarAnuncio from "./pages/InsertarAnuncio";
import CatalogoAnuncios from "./pages/CatalogoAnuncios";
import { AuthProvider } from "./AuthContext";

/* 🔹 Toastify */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const showToast = (msg) => toast(msg);

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-alt)",   // ✔ mismo azul que CatalogoAnuncios
        color: "var(--color-text)",               // ✔ texto azul oscuro
        minHeight: "100vh",
        width: "100%",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <AuthProvider>
        {/* 🔹 Header siempre visible */}
        <Header />

        <main
          style={{
            width: "100%",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <Routes>
            {/* 🔹 ANUNCIOS */}
            <Route
              path="/anuncio/:id"
              element={<AnuncioDetalles showToast={showToast} />}
            />
            <Route
              path="/editar-anuncio/:id"
              element={<EditarAnuncio showToast={showToast} />}
            />
            <Route
              path="/insertar-anuncio"
              element={<InsertarAnuncio showToast={showToast} />}
            />

            {/* 🔹 OTROS */}
            <Route path="/" element={<CatalogoAnuncios showToast={showToast} />} />
          </Routes>
        </main>

        {/* 🔹 Contenedor de Toasts */}
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


