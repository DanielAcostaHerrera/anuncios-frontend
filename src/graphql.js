import gql from "graphql-tag";

// =========================
// QUERIES
// =========================
export const GET_ANUNCIO = gql`
  query ($Id: Int!) {
    anuncio(Id: $Id) {
      Id
      Fotos
      Titulo
      Precio
      Moneda
      Descripcion
      Categoria
      IdSubcategoria
      Provincia
      Municipio
      NombreAnunciante
      Celular
      Fijo
      FechaActualizacion
    }
  }
`;

export const GET_ANUNCIOS = gql`
  query ($page: Int!) {
    anuncios(page: $page) {
      anuncios {
        Id
        Fotos
        Titulo
        Precio
        Moneda
        Descripcion
        Categoria
        IdSubcategoria
        Provincia
        Municipio
        NombreAnunciante
        Celular
        Fijo
        FechaActualizacion
      }
      total
    }
  }
`;

export const FILTRAR_ANUNCIOS = gql`
  query (
    $page: Int!
    $limit: Int!
    $titulo: String
    $precioMin: Float
    $precioMax: Float
    $provincia: Int
    $municipio: Int
    $categoria: Int
    $subcategoria: Int
    $fechaMin: String
    $fechaMax: String
  ) {
    filtrarAnuncios(
      page: $page
      limit: $limit
      titulo: $titulo
      precioMin: $precioMin
      precioMax: $precioMax
      provincia: $provincia
      municipio: $municipio
      categoria: $categoria
      subcategoria: $subcategoria
      fechaMin: $fechaMin
      fechaMax: $fechaMax
    ) {
      anuncios {
        Id
        Fotos
        Titulo
        Precio
        Moneda
        Descripcion
        Categoria
        IdSubcategoria
        Provincia
        Municipio
        NombreAnunciante
        Celular
        Fijo
        FechaActualizacion
      }
      total
    }
  }
`;

export const GET_CATEGORIA = gql`
  query ($Id: Int!) {
    categoria(Id: $Id) {
      Id
      nombre
    }
  }
`;

export const GET_CATEGORIAS = gql`
  query {
    categorias {
      Id
      nombre
    }
  }
`;

export const GET_MONEDA = gql`
  query ($Id: Int!) {
    moneda(Id: $Id) {
      Id
      nombre
    }
  }
`;


export const GET_MONEDAS = gql`
  query {
    monedas {
      Id
      nombre
    }
  }
`;

export const GET_MUNICIPIO = gql`
  query ($Id: Int!) {
    municipio(Id: $Id) {
      Id
      nombre
      IdProvincia
    }
  }
`;


export const GET_MUNICIPIOS = gql`
  query ($IdProvincia: Int!) {
    municipios(IdProvincia: $IdProvincia) {
      Id
      nombre
      IdProvincia
    }
  }
`;

export const GET_PROVINCIA = gql`
  query ($Id: Int!) {
    provincia(Id: $Id) {
      Id
      nombre
    }
  }
`;


export const GET_PROVINCIAS = gql`
  query {
    provincias {
      Id
      nombre
    }
  }
`;

export const GET_SUBCATEGORIA = gql`
  query ($Id: Int!) {
    subcategoria(Id: $Id) {
      Id
      nombre
      IdCategoria
    }
  }
`;


export const GET_SUBCATEGORIAS = gql`
  query ($IdCategoria: Int!) {
    subcategorias(IdCategoria: $IdCategoria) {
      Id
      nombre
      IdCategoria
    }
  }
`;