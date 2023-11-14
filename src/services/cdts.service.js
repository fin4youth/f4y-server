const CDT = require("../models/CDT");

module.exports = {
  calcularExistente(cdt) {
    const montoIntereses = parseFloat(
      (cdt.inversion * (cdt.interes / 100) * (cdt.duracion / 360)).toFixed(2)
    );
    const montoGanancia = parseFloat(
      (cdt.inversion + montoIntereses).toFixed(2)
    );
    const montoRetencion = parseFloat(
      (montoIntereses * (cdt.retencion / 100)).toFixed(2)
    );
    const montoDevolucion = parseFloat(
      (montoGanancia - montoRetencion).toFixed(2)
    );

    let estado = "";

    if (cdt.liquidado) {
      estado = "liquidado";
    } else if (cdt.cancelado) {
      estado = "cancelado";
    } else {
      const fechaServidor = new Date();
      const fechaInicioCDT = new Date(cdt.fechaInicio);
      const fechaFinCDT = new Date(cdt.fechaFin);
      const diferencia = fechaServidor - fechaInicioCDT;
      const cincoDias = 5 * 24 * 60 * 60 * 1000;

      if (diferencia <= cincoDias) {
        estado = "apertura";
      } else {
        estado = "en-curso";

        if (fechaServidor > fechaFinCDT) {
          estado = "finalizado";
        }
      }
    }

    const calculos = {
      montoIntereses,
      montoGanancia,
      montoRetencion,
      montoDevolucion,
      estado,
    };
    return calculos;
  },

  calcularNuevo(inversion, duracion, fechaInicio) {
    const interes = 12.25;
    const retencion = 4;

    const montoIntereses = parseFloat(
      (inversion * (interes / 100) * (duracion / 360)).toFixed(2)
    );
    const montoGanancia = parseFloat((inversion + montoIntereses).toFixed(2));
    const montoRetencion = parseFloat(
      (montoIntereses * (retencion / 100)).toFixed(2)
    );
    const montoDevolucion = parseFloat(
      (montoGanancia - montoRetencion).toFixed(2)
    );
    const fechaDate = new Date(fechaInicio);
    fechaDate.setDate(fechaDate.getDate() + duracion);
    const fechaFin = fechaDate.toISOString().split("T")[0];

    const cdt = {
      inversion,
      duracion,
      fechaInicio,
      fechaFin,
      interes,
      retencion,
      montoIntereses,
      montoGanancia,
      montoRetencion,
      montoDevolucion,
    };
    return cdt;
  },

  async obtenerTodos(cuenta) {
    const cdts = await CDT.findAll({
      where: { cuenta },
      order: [
        ["cancelado", "ASC"],
        ["liquidado", "ASC"],
        ["fechaFin", "ASC"],
      ],
    });
    return cdts;
  },

  async obtener(id, cuenta) {
    const cdt = CDT.findOne({ where: { id, cuenta } });
    return cdt;
  },

  async crear(
    cuenta,
    inversion,
    interes,
    retencion,
    duracion,
    fechaInicio,
    fechaFin
  ) {
    const cdt = CDT.create({
      cuenta,
      inversion,
      interes,
      retencion,
      duracion,
      fechaInicio,
      fechaFin,
    });
    return cdt;
  },

  async liquidar(id, cuenta) {
    const [affectedCount] = await CDT.update(
      { liquidado: true },
      { where: { id, cuenta } }
    );
    return affectedCount > 0;
  },

  async cancelar(id, cuenta) {
    const [affectedCount] = await CDT.update(
      { cancelado: true },
      { where: { id, cuenta } }
    );
    return affectedCount > 0;
  },
};
