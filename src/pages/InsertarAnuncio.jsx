import { useNavigate } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import "../App.css";
import { useState } from "react";
import { CREAR_ANUNCIO } from "../mutations";
import {
  GET_CATEGORIAS,
  GET_SUBCATEGORIAS,
  GET_PROVINCIAS,
  GET_MUNICIPIOS,
  GET_MONEDAS,
  GET_ANUNCIOS,
} from "../graphql";

export default function InsertarAnuncio({ showToast }) {
  const navigate = useNavigate();

  const [Titulo, setTitulo] = useState("");
  const [Precio, setPrecio] = useState("");
  const [Moneda, setMoneda] = useState("CUP");
  const [Categoria, setCategoria] = useState("");
  const [Subcategoria, setSubcategoria] = useState("");
  const [Provincia, setProvincia] = useState("");
  const [Municipio, setMunicipio] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [NombreAnunciante, setNombreAnunciante] = useState("");
  const [Celular, setCelular] = useState("");
  const [Fijo, setFijo] = useState("");
  const [fileSeleccionado, setFileSeleccionado] = useState(null);

  // Subir foto con nombre = título
  const subirFoto = async (file, titulo) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("nombre", titulo.trim());

    const res = await fetch("https://anuncios-backend.onrender.com/upload", {
      method: "POST",
      headers: {
        Accept: "application/json", // ← IMPORTANTE para evitar error 400
      },
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  // Construcción del payload inicial (sin foto)
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
    Titulo: Titulo.trim(),
    Precio: Number(Precio),

    Descripcion: Descripcion.trim(),

    // Todos estos combos ya devuelven el Id directamente
    Categoria: Number(Categoria),
    IdSubcategoria: Number(Subcategoria),
    Provincia: Number(Provincia),
    Municipio: Number(Municipio),
    Moneda: Number(Moneda),
    Celular: Celular.trim() || null,
    Fijo: Fijo.trim() || null,

    NombreAnunciante: NombreAnunciante.trim(),
    FechaActualizacion: new Date().toISOString(),
  };

  return payload;
};


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
      <h2 className="detalle-titulo">Añadir Nuevo Anuncio</h2>

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
        {/* Foto */}
        <div className="detalle-portada insertar-portada" style={{ flex: 1 }}>
          <label>Foto del anuncio:</label>
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

        <div className="detalle-info" style={{ flex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
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
          {Categoria && (
            <>
              <label>Subcategoría</label>
              <Query
                query={GET_SUBCATEGORIAS}
                variables={{ IdCategoria: parseInt(Categoria) }}
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
          )}

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
          {Provincia && (
            <>
              <label>Municipio</label>
              <Query
                query={GET_MUNICIPIOS}
                variables={{ IdProvincia: parseInt(Provincia) }}
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
          )}
        </div>
      </div>

      {/* EXTRA */}
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
              textAlign: "justify",
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
      <Mutation mutation={CREAR_ANUNCIO}>
        {(crearAnuncio) => (
          <button
            className="btn-guardar"
            onClick={async () => {
              const payload = construirPayload();
              if (!payload) return;

              try {
                if (!fileSeleccionado) {
                  showToast("Debe seleccionar una foto");
                  return;
                }

                const fotoUrl = await subirFoto(fileSeleccionado, Titulo);
                if (!fotoUrl) {
                  showToast("Error subiendo la foto");
                  return;
                }

                payload.Fotos = fotoUrl;

                const res = await crearAnuncio({
                  variables: { data: payload },
                  refetchQueries: [{ query: GET_ANUNCIOS }],
                });

                if (!res.data?.crearAnuncio) {
                  showToast("No se pudo añadir el anuncio");
                  return;
                }

                showToast("Anuncio añadido correctamente");
                navigate("/");
              } catch (err) {
                console.error(err);
                showToast("Error añadiendo el anuncio");
              }
            }}
          >
            Añadir Anuncio
          </button>
        )}
      </Mutation>
    </div>
  );
}


