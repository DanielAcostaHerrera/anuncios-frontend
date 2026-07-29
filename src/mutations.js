import gql from "graphql-tag";

export const CREAR_ANUNCIO = gql`
  mutation ($data: CrearAnuncioInput!) {
    crearAnuncio(data: $data) {
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

export const ACTUALIZAR_ANUNCIO = gql`
  mutation ($data: ActualizarAnuncioInput!) {
    actualizarAnuncio(data: $data) {
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

export const ELIMINAR_ANUNCIO = gql`
  mutation ($Id: Int!) {
    eliminarAnuncio(Id: $Id)
  }
`;