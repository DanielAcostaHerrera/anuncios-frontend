import { Query } from "react-apollo";
import { GET_ANUNCIO, GET_PROVINCIAS, GET_MUNICIPIOS, GET_MONEDAS } from "../graphql";
import "../App.css";
import { useParams } from "react-router-dom";

export default function AnuncioDetalles() {
  const { id } = useParams();

  return (
    <Query query={GET_ANUNCIO} variables={{ Id: Number(id) }}>
      {({ loading, error, data }) => {
        if (loading) return <p>Cargando anuncio…</p>;
        if (error) return <p>Error cargando anuncio</p>;

        const a = data.anuncio;

        // Función para enviar WhatsApp con número formateado
        const enviarWhatsApp = () => {
          if (!a.Celular) return;

          let numero = a.Celular.toString().replace(/\D/g, "");
          if (!numero.startsWith("53")) {
            numero = "53" + numero;
          }

          const mensaje = `Hola, le escribo en relación a su anuncio: ${a.Titulo}`;
          const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

          window.open(url, "_blank");
        };

        // Normalizar número fijo (pero ya NO se usa para llamar)
        let fijo = a.Fijo?.toString().replace(/\D/g, "") || "";
        if (fijo && !fijo.startsWith("53")) {
          fijo = "53" + fijo;
        }

        return (
          <div className="ver-wrapper">

            {/* Imagen */}
            <div className="ver-imagen">
              <img src={a.Fotos} alt={a.Titulo} />
            </div>

            {/* Título */}
            <h2 className="ver-titulo">{a.Titulo}</h2>

            {/* Precio + moneda */}
            <Query query={GET_MONEDAS}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return null;

                const moneda = data.monedas.find(m => m.Id === a.Moneda)?.nombre || "";

                return (
                  <p className="ver-precio">
                    {a.Precio} {moneda}
                  </p>
                );
              }}
            </Query>

            {/* Fecha + ubicación */}
            <div className="ver-info-fila">
              <span className="ver-fecha">
                Actualizado: {new Date(a.FechaActualizacion).toLocaleDateString()}
              </span>

              <span className="ver-ubicacion">
                <Query query={GET_PROVINCIAS}>
                  {({ loading, error, data }) => {
                    if (loading || error) return null;
                    const provincia = data.provincias.find(p => p.Id === a.Provincia)?.nombre || "";
                    return (
                      <Query query={GET_MUNICIPIOS} variables={{ IdProvincia: a.Provincia }}>
                        {({ loading, error, data }) => {
                          if (loading || error) return provincia;

                          const municipio = data.municipios.find(m => m.Id === a.Municipio)?.nombre;

                          return municipio ? `${municipio}, ${provincia}` : provincia;
                        }}
                      </Query>
                    );
                  }}
                </Query>
              </span>
            </div>

            {/* Botones de contacto */}
            <div className="ver-contacto">

              {/* WhatsApp */}
              {a.Celular && (
                <button className="btn-whatsapp" onClick={enviarWhatsApp}>
                  📱 WhatsApp: {a.Celular}
                </button>
              )}

              {/* Teléfono fijo — YA NO ES CLICKEABLE */}
              {a.Fijo && (
                <div className="btn-llamar" style={{ cursor: "default" }}>
                  ☎️ Fijo: {a.Fijo}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="ver-descripcion">
              <p>{a.Descripcion}</p>
            </div>

          </div>
        );
      }}
    </Query>
  );
}


