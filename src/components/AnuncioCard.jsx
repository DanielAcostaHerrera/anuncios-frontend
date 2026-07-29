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
        border: "1px solid #2a2a2a",
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#1e1e1e",
      }}
    >
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
            objectFit: "cover",
            backgroundColor: "#000",
            transition: "transform 0.2s, boxShadow 0.2s",
            display: "block",
          }}
          loading="lazy"
        />

        <h3
          style={{
            margin: 8,
            fontSize: 15,
            color: "#f0f0f0",
            textAlign: "center",
          }}
        >
          {anuncio.Titulo}
        </h3>

        {/* ============================
            MOSTRAR NOMBRE DE LA MONEDA
           ============================ */}
        <Query query={GET_MONEDA} variables={{ Id: anuncio.Moneda }}>
          {({ loading, error, data }) => {
            const monedaNombre =
              loading || error ? anuncio.Moneda : data.moneda.nombre;

            return (
              <p
                style={{
                  margin: 8,
                  fontSize: 14,
                  color: "#ccc",
                  textAlign: "center",
                }}
              >
                {anuncio.Precio} {monedaNombre}
              </p>
            );
          }}
        </Query>
      </Link>

      {auth.isLogged && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Mutation mutation={ELIMINAR_ANUNCIO}>
            {(eliminarAnuncio) => (
              <>
                <button
                  onClick={handleEdit}
                  className="admin-edit-btn"
                >
                  ✏️
                </button>

                <button
                  onClick={async () => {
                    console.log("anuncio.Fotos =", anuncio.Fotos);

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






