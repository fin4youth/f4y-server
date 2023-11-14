const express = require("express");
const CDTsController = require("../controllers/cdts.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const utils = require("../../utils");

const cdtsController = express.Router();

const INVERSION = utils.createParam("inversion", "number", false);
const DURACION = utils.createParam("duracion", "number", false);
const FECHA_INICIO = utils.createParam("fechaInicio", "string", false);
const ID = utils.createParam("id", "number", false);

const _cdtsController = new CDTsController();

cdtsController.post(
  "/calcular",
  [authMiddleware, validatorMiddleware([INVERSION, DURACION, FECHA_INICIO])],
  _cdtsController.calcular
);

cdtsController.get(
  "/obtener-todos",
  [authMiddleware],
  _cdtsController.obtenerTodos
);

cdtsController.post(
  "/obtener",
  [authMiddleware, validatorMiddleware([ID])],
  _cdtsController.obtener
);

cdtsController.post(
  "/crear",
  [authMiddleware, validatorMiddleware([INVERSION, DURACION, FECHA_INICIO])],
  _cdtsController.crear
);

cdtsController.post(
  "/liquidar",
  [authMiddleware, validatorMiddleware([ID])],
  _cdtsController.liquidar
);

cdtsController.post(
  "/cancelar",
  [authMiddleware, validatorMiddleware([ID])],
  _cdtsController.cancelar
);

module.exports = cdtsController;
