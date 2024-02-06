import EnumsError from "../utils/EnumsError.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  console.error(error.cause || error.message);
  switch (error.code) {
    case EnumsError.BAD_REQUEST_ERROR:
    case EnumsError.INVALID_PARAMS_ERROR:
      res.status(400).json({ status: 'error', message: error.message, cause: error.cause });
      break;
    case EnumsError.UNAUTHORIZED_ERROR:
      res.status(401).json({ status: 'error', message: error.message, cause: error.cause });
      break;
    case EnumsError.FORBIDDEN_ERROR:
      res.status(403).json({ status: 'error', message: error.message, cause: error.cause });
      break;
    case EnumsError.NOT_FOUND_ERROR:
      res.status(404).json({ status: 'error', message: error.message, cause: error.cause });
      break;
    case EnumsError.DATA_BASE_ERROR:
    case EnumsError.ROUTING_ERROR:
    default:
      res.status(500).json({ status: 'error', message: error.message });
  }
}