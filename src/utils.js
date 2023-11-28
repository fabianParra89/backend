import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const URL_BASE = 'http://localhost:8080/api';

export const buildResponsePaginated = (data, baseUrl = URL_BASE) => {
    console.log(data);
    const {docs, totalPages,prevPage, nextPage, page, hasPrevPage, hasNextPage, sort, limit, search} = data
    return {
      //status:success/error
      status: 'success',
      //payload: Resultado de los productos solicitados
      payload: docs.map((doc) => doc.toJSON()),
      //totalPages: Total de páginas
      totalPages: totalPages,
      //prevPage: Página anterior
      prevPage: prevPage,
      //nextPage: Página siguiente
      nextPage: nextPage,
      //page: Página actual
      page: page,
      //hasPrevPage: Indicador para saber si la página previa existe
      hasPrevPage: hasPrevPage,
      //hasNextPage: Indicador para saber si la página siguiente existe.
      hasNextPage: hasNextPage,
      //prevLink: Link directo a la página previa (null si hasPrevPage=false)
      prevLink: hasPrevPage ? `${baseUrl}/products/?limit=${limit}&page=${prevPage}${sort ? `&sort=${sort}`: ''}${search ? `&search=${search}`: ''}` : null,
      //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
      nextLink: hasNextPage ? `${baseUrl}/products/?limit=${limit}&page=${nextPage}${sort ? `&sort=${sort}`: ''}${search ? `&search=${search}`: ''}` : null,
    };  
  };