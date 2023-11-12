const express = require("express");
const MovimientosController = require("../controllers/movimientos.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const utils = require("../../utils");

const movimientosRouter = express.Router();

const _movimientosController = new MovimientosController();

movimientosRouter.get(
  "/obtener-ultimos",
  [authMiddleware],
  _movimientosController.obtenerUltimos
);

module.exports = movimientosRouter;