const utils = require("../../utils");
const movimientosService = require("../services/movimientos.service");
const cuentasService = require("../services/cuentas.service");
const jwtService = require("../services/jwt.service");

class MovimientosController {
  constructor() {}

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerUltimos(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const movimientos = await movimientosService.obtenerUltimos(idCuenta);

        return res
          .status(200)
          .json(
            utils.successResponse(
              "Últimos movimientos obtenidos correctamente.",
              { movimientos }
            )
          );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener los últimos movimientos.",
            null
          )
        );
    }
  }
}

module.exports = MovimientosController;
