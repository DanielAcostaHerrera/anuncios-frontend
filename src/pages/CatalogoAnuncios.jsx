import { useState, useEffect } from "react";
import { Query } from "react-apollo";
import {
  GET_ANUNCIOS,
  FILTRAR_ANUNCIOS,
  GET_CATEGORIAS,
  GET_SUBCATEGORIAS,
  GET_PROVINCIAS,
  GET_MUNICIPIOS,
  GET_MONEDAS,
} from "../graphql";
import AnuncioCard from "../components/AnuncioCard";
import Paginacion from "../components/Paginacion";
import "../App.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function CatalogoAnuncios({ showToast }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(100);

  // Filtros definitivos (los que se usan en la query)
  const [filtros, setFiltros] = useState({
    titulo: searchParams.get("titulo") || "",
    moneda: searchParams.get("moneda") || "", 
    precioMin: searchParams.get("precioMin") || "",
    precioMax: searchParams.get("precioMax") || "",
    provincia: searchParams.get("provincia") || "",
    municipio: searchParams.get("municipio") || "",
    categoria: searchParams.get("categoria") || "",
    subcategoria: searchParams.get("subcategoria") || "",
    fechaMin: searchParams.get("fechaMin") || "",
    fechaMax: searchParams.get("fechaMax") || "",
  });

  // Filtros en edición (lo que el usuario escribe antes de pulsar Buscar)
  const [draftFiltros, setDraftFiltros] = useState(filtros);

  useEffect(() => {
  const newPage = Number(searchParams.get("page")) || 1;
  setTimeout(() => {
    setPage(prev => (prev !== newPage ? newPage : prev));
      }, 0);
    }, [searchParams]);

  const handleChange = (campo, valor) => {
    setDraftFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const aplicarFiltros = () => {
    // Validaciones básicas
    if (draftFiltros.fechaMin && draftFiltros.fechaMax) {
      if (new Date(draftFiltros.fechaMin) > new Date(draftFiltros.fechaMax)) {
        alert("La fecha inicial debe ser menor o igual a la fecha final");
        return;
      }
    }
    if (draftFiltros.precioMin && draftFiltros.precioMax) {
      if (parseInt(draftFiltros.precioMin) > parseInt(draftFiltros.precioMax)) {
        alert("El precio mínimo no puede ser mayor que el máximo");
        return;
      }
    }

    // Aplicar filtros definitivos
    setFiltros(draftFiltros);
    setPage(1);

    const newParams = new URLSearchParams();
    Object.entries(draftFiltros).forEach(([campo, valor]) => {
      if (valor) newParams.set(campo, valor);
    });
    newParams.set("page", 1);
    setSearchParams(newParams, { replace: true });
  };

  const soloNumeros = (e) => {
    const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
    if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
      e.preventDefault();
    }
  };

  const query =
    filtros.titulo ||
    filtros.moneda || 
    filtros.precioMin ||
    filtros.precioMax ||
    filtros.provincia ||
    filtros.municipio ||
    filtros.categoria ||
    filtros.subcategoria ||
    filtros.fechaMin ||
    filtros.fechaMax
      ? FILTRAR_ANUNCIOS
      : GET_ANUNCIOS;

  const variables = {
    page,
    limit,
    titulo: filtros.titulo || null,
    moneda: filtros.moneda !== "" ? parseInt(filtros.moneda) : undefined,
    precioMin: filtros.precioMin !== "" ? parseInt(filtros.precioMin) : undefined,
    precioMax: filtros.precioMax !== "" ? parseInt(filtros.precioMax) : undefined,
    provincia: filtros.provincia !== "" ? parseInt(filtros.provincia) : undefined,
    municipio: filtros.municipio !== "" ? parseInt(filtros.municipio) : undefined,
    categoria: filtros.categoria !== "" ? parseInt(filtros.categoria) : undefined,
    subcategoria: filtros.subcategoria !== "" ? parseInt(filtros.subcategoria) : undefined,
    fechaMin: filtros.fechaMin || undefined,
    fechaMax: filtros.fechaMax || undefined,
  };

  const reiniciarCatalogo = () => {
    const reset = {
      titulo: "",
      moneda: "", 
      precioMin: "",
      precioMax: "",
      provincia: "",
      municipio: "",
      categoria: "",
      subcategoria: "",
      fechaMin: "",
      fechaMax: "",
    };
    setFiltros(reset);
    setDraftFiltros(reset);
    setPage(1);
    setSearchParams({ page: 1 });
  };

  return (
    <div
      className="catalogo-container"
      style={{
        backgroundColor: "var(--color-bg-alt)",   // azul clarito
        padding: 20,
        borderRadius: 10,
      }}
    >
      <h2
        style={{
          color: "var(--color-text)",
          marginBottom: "20px",
          textAlign: "center"
        }}
      >
        Anuncios
      </h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        {auth.isLogged && (
          <button
            className="btn-dark"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: `1px solid var(--color-primary-dark)`
            }}
            onClick={() =>
              navigate("/insertar-anuncio", { state: { from: location.pathname } })
            }
          >
            Añadir Anuncio
          </button>
        )}
      </div>

      {/* Bloque principal */}
      <div
        className="filtros-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          backgroundColor: "var(--color-bg)",   // azul más suave
          padding: 15,
          borderRadius: 10,
        }}
      >
        {/* Título */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ color: "var(--color-text)" }}>Título</label>
          <input
            type="text"
            value={draftFiltros.titulo}
            onChange={(e) => handleChange("titulo", e.target.value)}
            className="filtro-input"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "#fff",
              color: "var(--color-text)"
            }}
          />
        </div>

        {/* Moneda */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ color: "var(--color-text)" }}>Moneda</label>
          <Query query={GET_MONEDAS}>
            {({ loading, error, data }) => {
              if (loading)
                return <p style={{ color: "var(--color-text)" }}>Cargando monedas…</p>;
              if (error)
                return <p style={{ color: "var(--color-text)" }}>Error cargando monedas</p>;
              return (
                <select
                  value={draftFiltros.moneda}
                  onChange={(e) => handleChange("moneda", e.target.value)}
                  className="filtro-input"
                  style={{
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#fff",
                    color: "var(--color-text)"
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
        </div>

        {/* Precios (solo si hay moneda) */}
        {draftFiltros.moneda !== "" && (
          <>
            <div>
              <label style={{ color: "var(--color-text)" }}>Precio mínimo</label>
              <input
                type="text"
                value={draftFiltros.precioMin}
                onChange={(e) => handleChange("precioMin", e.target.value)}
                onKeyDown={soloNumeros}
                className="filtro-input"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: "#fff",
                  color: "var(--color-text)"
                }}
              />
            </div>

            <div>
              <label style={{ color: "var(--color-text)" }}>Precio máximo</label>
              <input
                type="text"
                value={draftFiltros.precioMax}
                onChange={(e) => handleChange("precioMax", e.target.value)}
                onKeyDown={soloNumeros}
                className="filtro-input"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: "#fff",
                  color: "var(--color-text)"
                }}
              />
            </div>
          </>
        )}

        {/* Fechas */}
        <div>
          <label style={{ color: "var(--color-text)" }}>Fecha mínima</label>
          <input
            type="date"
            value={draftFiltros.fechaMin}
            onChange={(e) => handleChange("fechaMin", e.target.value)}
            className="filtro-input"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "#fff",
              color: "var(--color-text)"
            }}
          />
        </div>

        <div>
          <label style={{ color: "var(--color-text)" }}>Fecha máxima</label>
          <input
            type="date"
            value={draftFiltros.fechaMax}
            onChange={(e) => handleChange("fechaMax", e.target.value)}
            className="filtro-input"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "#fff",
              color: "var(--color-text)"
            }}
          />
        </div>

        {/* Categoría + Subcategoría */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ color: "var(--color-text)" }}>Categoría</label>
          <Query query={GET_CATEGORIAS}>
            {({ loading, error, data }) => {
              if (loading)
                return <p style={{ color: "var(--color-text)" }}>Cargando categorías…</p>;
              if (error)
                return <p style={{ color: "var(--color-text)" }}>Error cargando categorías</p>;
              return (
                <select
                  value={draftFiltros.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                  className="filtro-input"
                  style={{
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#fff",
                    color: "var(--color-text)"
                  }}
                >
                  <option value="">Todas las categorías</option>
                  {data.categorias.map((c) => (
                    <option key={c.Id} value={c.Id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              );
            }}
          </Query>

          {draftFiltros.categoria && (
            <>
              <label style={{ color: "var(--color-text)" }}>Subcategoría</label>
              <Query
                query={GET_SUBCATEGORIAS}
                variables={{ IdCategoria: parseInt(draftFiltros.categoria) }}
              >
                {({ loading, error, data }) => {
                  if (loading)
                    return <p style={{ color: "var(--color-text)" }}>Cargando subcategorías…</p>;
                  if (error)
                    return <p style={{ color: "var(--color-text)" }}>Error cargando subcategorías</p>;
                  return (
                    <select
                      value={draftFiltros.subcategoria}
                      onChange={(e) => handleChange("subcategoria", e.target.value)}
                      className="filtro-input"
                      style={{
                        border: "1px solid var(--color-border)",
                        backgroundColor: "#fff",
                        color: "var(--color-text)"
                      }}
                    >
                      <option value="">Todas las subcategorías</option>
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
        </div>

        {/* Provincia + Municipio */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ color: "var(--color-text)" }}>Provincia</label>
          <Query query={GET_PROVINCIAS}>
            {({ loading, error, data }) => {
              if (loading)
                return <p style={{ color: "var(--color-text)" }}>Cargando provincias…</p>;
              if (error)
                return <p style={{ color: "var(--color-text)" }}>Error cargando provincias</p>;
              return (
                <select
                  value={draftFiltros.provincia}
                  onChange={(e) => handleChange("provincia", e.target.value)}
                  className="filtro-input"
                  style={{
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#fff",
                    color: "var(--color-text)"
                  }}
                >
                  <option value="">Todas las provincias</option>
                  {data.provincias.map((p) => (
                    <option key={p.Id} value={p.Id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              );
            }}
          </Query>

          {draftFiltros.provincia && (
            <>
              <label style={{ color: "var(--color-text)" }}>Municipio</label>
              <Query
                query={GET_MUNICIPIOS}
                variables={{ IdProvincia: parseInt(draftFiltros.provincia) }}
              >
                {({ loading, error, data }) => {
                  if (loading)
                    return <p style={{ color: "var(--color-text)" }}>Cargando municipios…</p>;
                  if (error)
                    return <p style={{ color: "var(--color-text)" }}>Error cargando municipios</p>;
                  return (
                    <select
                      value={draftFiltros.municipio}
                      onChange={(e) => handleChange("municipio", e.target.value)}
                      className="filtro-input"
                      style={{
                        border: "1px solid var(--color-border)",
                        backgroundColor: "#fff",
                        color: "var(--color-text)"
                      }}
                    >
                      <option value="">Todos los municipios</option>
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

      {/* Botones de acción */}
      <div style={{ marginTop: "20px", marginBottom: "25px", display: "flex", gap: 10 }}>
        <button
          className="btn-dark"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: `1px solid var(--color-primary-dark)`
          }}
          onClick={aplicarFiltros}
        >
          Buscar
        </button>

        <button
          className="btn-dark"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: `1px solid var(--color-primary-dark)`
          }}
          onClick={reiniciarCatalogo}
        >
          Limpiar Filtros
        </button>
      </div>

      <Query query={query} variables={variables} fetchPolicy="network-only">
        {({ loading, error, data }) => {
          if (loading)
            return <p style={{ color: "var(--color-text-light)" }}>Cargando…</p>;
          if (error)
            return <p style={{ color: "red" }}>Error: {error.message}</p>;

          const anuncios =
            data?.anuncios?.anuncios || data?.filtrarAnuncios?.anuncios || [];
          const total =
            data?.anuncios?.total || data?.filtrarAnuncios?.total || 0;
          const totalPages = Math.ceil(total / limit);

          return (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px"
                }}
              >
                {anuncios.map((a) => (
                  <AnuncioCard
                    key={a.Id}
                    anuncio={a}
                    showToast={showToast}
                    from={location.pathname + location.search}
                  />
                ))}
              </div>

              <Paginacion
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  const params = {
                    ...Object.fromEntries(searchParams.entries()),
                    page: p
                  };
                  setSearchParams(params);
                }}
              />
            </>
          );
        }}
      </Query>
    </div>
  );
}
