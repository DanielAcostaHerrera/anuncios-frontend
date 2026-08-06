import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Mutation, Query } from "react-apollo";
import { ELIMINAR_ANUNCIO } from "../mutations";
import { GET_MONEDA } from "../graphql";

export default function AnuncioCard({ anuncio, showToast, from }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fotoUrl = anuncio.Fotos;

  function handleEdit() {
    navigate(`/editar-anuncio/${anuncio.Id}`, {
      state: { from: location.pathname }
    });
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // 🔥 botones siempre abajo
      }}
    >
      {/* Bloque superior: imagen, precio, título */}
      <div>
        <Link
          to={`/anuncio/${anuncio.Id}`}
          state={{ from }}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <img
            src={fotoUrl}
            alt={anuncio.Titulo}
            style={{
              width: "100%",
              height: 180,
              objectFit: "fill",
              backgroundColor: "var(--color-bg-alt)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "block",
            }}
            loading="lazy"
          />

          <Query query={GET_MONEDA} variables={{ Id: anuncio.Moneda }}>
            {({ loading, error, data }) => {
              const monedaNombre =
                loading || error ? anuncio.Moneda : data.moneda.nombre;
              const precioFormateado = Number(anuncio.Precio).toLocaleString("es-ES");

              return (
                <p
                  style={{
                    margin: "8px",
                    fontSize: 14,
                    color: "var(--color-text-light)",
                    textAlign: "justify",
                    fontWeight: 600, 
                  }}
                >
                  {precioFormateado} {monedaNombre}
                </p>
              );
            }}
          </Query>

          <h3
            style={{
              margin: "8px",
              fontSize: 15,
              color: "var(--color-text)",
              textAlign: "justify",
              fontWeight: "normal", 
            }}
          >
            {anuncio.Titulo}
          </h3>
        </Link>
      </div>

      {/* Bloque inferior: botones alineados al fondo */}
      {auth.isLogged && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: "8px",
          }}
        >
          <Mutation mutation={ELIMINAR_ANUNCIO}>
            {(eliminarAnuncio) => (
              <>
                {/* Botón editar */}
                <button
                  onClick={handleEdit}
                  className="admin-edit-btn"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    border: "1px solid var(--color-primary-dark)",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  ✏️
                </button>

                {/* Botón eliminar */}
                <button
                  onClick={async () => {
                    if (!window.confirm(`¿Eliminar el anuncio "${anuncio.Titulo}"?`)) return;

                    try {
                      const tieneFoto = anuncio.Fotos && anuncio.Fotos.trim() !== "";

                      if (tieneFoto) {
                        const fotoRes = await fetch(
                          "https://anuncios-backend.onrender.com/upload/image",
                          {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: anuncio.Fotos }),
                          }
                        );

                        if (!fotoRes.ok) {
                          showToast("Error eliminando la foto. No se eliminará el anuncio.");
                          return;
                        }
                      }

                      const res = await eliminarAnuncio({
                        variables: { Id: anuncio.Id },
                      });

                      if (res.data.eliminarAnuncio) {
                        showToast("Anuncio eliminado correctamente");
                        window.location.reload();
                      } else {
                        showToast("No se pudo eliminar el anuncio");
                      }

                    } catch (err) {
                      console.error(err);
                      showToast("Error eliminando el anuncio");
                    }
                  }}
                  className="admin-delete-btn"
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "1px solid #c0392b",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </Mutation>
        </div>
      )}
    </div>
  );
}









