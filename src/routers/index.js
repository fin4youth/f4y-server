// Configuración de router
var express = require("express");
var appRouter = express.Router();

// Importar rutas
const cuentasRouter = require("./cuentas.router");
const movimientosRouter = require("./movimientos.router");

// Usar rutas
appRouter.use("/cuentas", cuentasRouter);
appRouter.use("/movimientos", movimientosRouter);

module.exports = appRouter;
