import TicketsServices from "../services/ticket.service.js";
import { v4 as uuidV4 } from "uuid";

import { CustomError } from "../utils/CustomError.js";
import { generatorTicketError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";

export default class TicketsController {


  static async create(data) {
    console.log(data);

    const {
      amount,
      purchaser,
      purchaser_datetime,
    } = data
    
    if (!amount || !purchaser || !purchaser_datetime) {
      CustomError.create(
        {
          name: 'Informacion del ticket invalida',
          cause: generatorTicketError(data),
          message: 'Error al intentar crear un nuevo ticket',
          code: EnumsError.BAD_REQUEST_ERROR,
        }
      )
      // throw new InvalidDataException('Todos los campos son requidos 😱');
    }
    const newData = {
      code: uuidV4(),
      amount,
      purchaser,
      purchaser_datetime,
    }

    return await TicketsServices.create(newData);
  }
}