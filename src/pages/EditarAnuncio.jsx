import { useNavigate, useParams } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import "../App.css";
import { useState, useEffect } from "react";
import {
  GET_ANUNCIO,
  GET_CATEGORIAS,
  GET_SUBCATEGORIAS,
  GET_PROVINCIAS,
  GET_MUNICIPIOS,
  GET_MONEDAS,
} from "../graphql";
import { ACTUALIZAR_ANUNCIO } from "../mutations";

export default function EditarAnuncio({ showToast }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [Titulo, setTitulo] = useState("");
  const [Precio, setPrecio] = useState("");
  const [Moneda, setMoneda] = useState("");
  const [Categoria, setCategoria] = useState("");
  const [Subcategoria, setSubcategoria] = useState("");
  const [Provincia, setProvincia] = useState("");
  const [Municipio, setMunicipio] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [NombreAnunciante, setNombreAnunciante] = useState("");
  const [Celular, setCelular] = useState("");
  const [Fijo, setFijo] = useState("");
  const [FotoActual, setFotoActual] = useState("");
  const [fileSeleccionado, setFileSeleccionado] = useState(null);

  // Subir foto con nombre = título
  const subirFoto = async (file, titulo) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nombre", titulo.trim());

    const res = await fetch("https://anuncios-backend.onrender.com/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  // Borrar foto anterior
  const borrarFoto = async (url) => {
    const res = await fetch(
      "https://anuncios-backend.onrender.com/upload/image",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }
    );
    return res.ok;
  };

  // Cargar datos del anuncio en los estados
  const cargarDatos = (a) => {
    setTitulo(a.Titulo);
    setPrecio(String(a.Precio));
    setMoneda(String(a.Moneda));            // ← CORREGIDO
    setCategoria(String(a.Categoria));      // ← CORREGIDO
    setSubcategoria(String(a.IdSubcategoria)); // ← CORREGIDO
    setProvincia(String(a.Provincia));      // ← CORREGIDO
    setMunicipio(String(a.Municipio));      // ← CORREGIDO
    setDescripcion(a.Descripcion);
    setNombreAnunciante(a.NombreAnunciante);
    setCelular(a.Celular || "");
    setFijo(a.Fijo || "");
    setFotoActual(a.Fotos);
  };


  // Construcción del payload
  const construirPayload = () => {
    if (Titulo.trim() === "") {
      alert("El título es obligatorio");
      return null;
    }

    if (Precio.trim() === "" || isNaN(Number(Precio))) {
      alert("El precio debe ser un número válido");
      return null;
    }

    if (Descripcion.trim() === "") {
      alert("La descripción es obligatoria");
      return null;
    }

    if (!Moneda) {
      alert("Debe seleccionar moneda");
      return null;
    }

    if (!Categoria) {
      alert("Debe seleccionar categoría");
      return null;
    }

    if (!Subcategoria) {
      alert("Debe seleccionar subcategoría");
      return null;
    }

    if (!Provincia) {
      alert("Debe seleccionar provincia");
      return null;
    }

    if (!Municipio) {
      alert("Debe seleccionar municipio");
      return null;
    }

    const payload = {
      Id: Number(id),
      Titulo: Titulo.trim(),
      Precio: Number(Precio),
      Descripcion: Descripcion.trim(),
      Categoria: Number(Categoria),
      IdSubcategoria: Number(Subcategoria),
      Provincia: Number(Provincia),
      Municipio: Number(Municipio),
      Moneda: Number(Moneda),
      Celular: Celular.trim() || null,
      Fijo: Fijo.trim() || null,
      NombreAnunciante: NombreAnunciante.trim(),
      FechaActualizacion: new Date().toISOString(),
      Fotos: FotoActual, // se actualiza si se cambia la foto
    };

    return payload;
  };

  // Estados para carga inicial
    const [anuncioBD, setAnuncioBD] = useState(null);

    // Cuando anuncioBD cambia, llenamos los estados
    useEffect(() => {
      if (anuncioBD) {
        // diferir la carga de estados al siguiente ciclo
        setTimeout(() => {
          cargarDatos(anuncioBD);
        }, 0);
      }
    }, [anuncioBD]);

    return (
  <Query query={GET_ANUNCIO} variables={{ Id: Number(id) }}>
    {({ loading, error, data }) => {
      if (loading) return <p>Cargando anuncio…</p>;
      if (error) return <p>Error cargando anuncio</p>;

      const anuncio = data.anuncio;

      if (!anuncioBD && anuncio) {
        Promise.resolve().then(() => setAnuncioBD(anuncio));
      }

      return (
        <div
          className="detalle-wrapper"
          style={{
            backgroundColor: "var(--color-bg)",
            padding: 20,
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            gap: 20
          }}
        >
          <h2 className="detalle-titulo">Editar Anuncio</h2>

          {/* CONTENEDOR PRINCIPAL */}
          <div
            className="detalle-container"
            style={{
              backgroundColor: "var(--color-bg)",
              padding: 15,
              borderRadius: 10,
              display: "flex",
              gap: 20,
              width: "100%",
              boxSizing: "border-box", 
            }}
          >
            {/* FOTO */}
            <div className="detalle-portada insertar-portada" style={{ flex: 1 }}>
              <label>Foto del anuncio:</label>

              {FotoActual && (
                <img
                  src={FotoActual}
                  alt="Foto actual"
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "fill",
                    marginBottom: 10,
                    borderRadius: 6,
                    border: "1px solid var(--color-border)"
                  }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFileSeleccionado(e.target.files[0])}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  padding: 8,
                  borderRadius: 6,
                  width: "100%"
                }}
              />
            </div>

            {/* INFORMACIÓN */}
            <div
              className="detalle-info"
              style={{ flex: 2, display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label>Título *</label>
              <input
                className="input-dark"
                value={Titulo}
                onChange={(e) => setTitulo(e.target.value)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: 8,
                  borderRadius: 6
                }}
              />

              <label>Precio *</label>
              <input
                className="input-dark"
                type="number"
                value={Precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: 8,
                  borderRadius: 6
                }}
              />

              <label>Moneda *</label>
              <Query query={GET_MONEDAS}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Cargando monedas…</p>;
                  if (error) return <p>Error cargando monedas</p>;

                  return (
                    <select
                      className="input-dark"
                      value={Moneda}
                      onChange={(e) => setMoneda(e.target.value)}
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                        padding: 8,
                        borderRadius: 6
                      }}
                    >
                      <option value="">Seleccione moneda</option>
                      {data.monedas.map((m) => (
                        <option key={m.Id} value={m.Id}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                  );
                }}
              </Query>

              {/* Categoría */}
              <label>Categoría</label>
              <Query query={GET_CATEGORIAS}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Cargando categorías…</p>;
                  if (error) return <p>Error cargando categorías</p>;
                  return (
                    <select
                      className="input-dark"
                      value={Categoria}
                      onChange={(e) => {
                        setCategoria(e.target.value);
                        setSubcategoria("");
                      }}
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                        padding: 8,
                        borderRadius: 6
                      }}
                    >
                      <option value="">Seleccione categoría</option>
                      {data.categorias.map((c) => (
                        <option key={c.Id} value={c.Id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  );
                }}
              </Query>

              {/* Subcategoría */}
              <>
                <label>Subcategoría</label>
                <Query
                  query={GET_SUBCATEGORIAS}
                  variables={{ IdCategoria: Number(Categoria) }}
                >
                  {({ loading, error, data }) => {
                    if (loading) return <p>Cargando subcategorías…</p>;
                    if (error) return <p>Error cargando subcategorías</p>;
                    return (
                      <select
                        className="input-dark"
                        value={Subcategoria}
                        onChange={(e) => setSubcategoria(e.target.value)}
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text)",
                          padding: 8,
                          borderRadius: 6
                        }}
                      >
                        <option value="">Seleccione subcategoría</option>
                        {data.subcategorias.map((s) => (
                          <option key={s.Id} value={s.Id}>
                            {s.nombre}
                          </option>
                        ))}
                      </select>
                    );
                  }}
                </Query>
              </>

              {/* Provincia */}
              <label>Provincia</label>
              <Query query={GET_PROVINCIAS}>
                {({ loading, error, data }) => {
                  if (loading) return <p>Cargando provincias…</p>;
                  if (error) return <p>Error cargando provincias</p>;
                  return (
                    <select
                      className="input-dark"
                      value={Provincia}
                      onChange={(e) => {
                        setProvincia(e.target.value);
                        setMunicipio("");
                      }}
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                        padding: 8,
                        borderRadius: 6
                      }}
                    >
                      <option value="">Seleccione provincia</option>
                      {data.provincias.map((p) => (
                        <option key={p.Id} value={p.Id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  );
                }}
              </Query>

              {/* Municipio */}
              <>
                <label>Municipio</label>
                <Query
                  query={GET_MUNICIPIOS}
                  variables={{ IdProvincia: Number(Provincia) }}
                >
                  {({ loading, error, data }) => {
                    if (loading) return <p>Cargando municipios…</p>;
                    if (error) return <p>Error cargando municipios</p>;
                    return (
                      <select
                        className="input-dark"
                        value={Municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text)",
                          padding: 8,
                          borderRadius: 6
                        }}
                      >
                        <option value="">Seleccione municipio</option>
                        {data.municipios.map((m) => (
                          <option key={m.Id} value={m.Id}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                    );
                  }}
                </Query>
              </>
            </div>
          </div>

          {/* DETALLE EXTRA — ME QUEDO AQUÍ COMO PEDISTE */}
          <div
            className="detalle-extra"
            style={{
              backgroundColor: "var(--color-bg)",
              padding: 15,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 15,
              width: "100%", 
              boxSizing: "border-box"
            }}
          >
            <div className="detalle-card">
              <strong>Descripción:</strong>
              <textarea
                className="input-dark"
                rows={8}
                value={Descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: 8,
                  borderRadius: 6
                }}
              />
            </div>

            <div className="detalle-card">
              <strong>Nombre del anunciante:</strong>
              <input
                className="input-dark"
                value={NombreAnunciante}
                onChange={(e) => setNombreAnunciante(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: 8,
                  borderRadius: 6
                }}
              />
            </div>

            <div className="detalle-card">
              <strong>Celular:</strong>
              <input
                className="input-dark"
                value={Celular}
                onChange={(e) => setCelular(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: 8,
                  borderRadius: 6
                }}
              />
            </div>

            <div className="detalle-card">
              <strong>Teléfono fijo:</strong>
              <input
                className="input-dark"
                value={Fijo}
                onChange={(e) => setFijo(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  padding: 8,
                  borderRadius: 6
                }}
              />
            </div>
          </div>

            {/* BOTÓN FINAL */}
              <Mutation mutation={ACTUALIZAR_ANUNCIO}>
                {(actualizarAnuncio) => (
                  <button
                    className="btn-guardar"
                    onClick={async () => {
                      const payload = construirPayload();
                      if (!payload) return;

                      try {
                        // Si se seleccionó nueva foto
                        if (fileSeleccionado) {
                          const ok = await borrarFoto(FotoActual);
                          if (!ok) {
                            showToast("Error eliminando la foto anterior");
                            return;
                          }

                          const nuevaUrl = await subirFoto(fileSeleccionado, Titulo);
                          if (!nuevaUrl) {
                            showToast("Error subiendo la nueva foto");
                            return;
                          }

                          payload.Fotos = nuevaUrl;
                        }

                        // Actualizar anuncio con refetchQueries
                        const res = await actualizarAnuncio({
                          variables: { data: payload },
                          refetchQueries: [
                            { query: GET_ANUNCIO, variables: { Id: payload.Id } }
                          ],
                        });

                        if (!res.data?.actualizarAnuncio) {
                          showToast("No se pudo actualizar el anuncio");
                          return;
                        }

                        showToast("Anuncio actualizado correctamente");
                        navigate(`/anuncio/${payload.Id}`);

                      } catch (err) {
                        console.error(err);
                        showToast("Error actualizando el anuncio");
                      }
                    }}
                  >
                    Guardar Cambios
                  </button>
                )}
              </Mutation>
          </div>
        );
      }}
    </Query>
  );
}


