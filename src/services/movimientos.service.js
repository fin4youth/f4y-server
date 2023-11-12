const { QueryTypes } = require("sequelize");
const sequelize = require("../../db");

module.exports = {
  async obtenerUltimos(idCuenta) {
    let movimientos = await sequelize.query(
      `
    SELECT * FROM (
      SELECT
      mov.id AS id,
      'carga-cuenta'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto AS monto
      FROM movimientos mov
      INNER JOIN transferencias_externas tex ON tex.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tex.carga = TRUE
      
      UNION ALL
      
      SELECT
      mov.id AS id,
      'descarga-cuenta'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto * -1 AS monto
      FROM movimientos mov
      INNER JOIN transferencias_externas tex ON tex.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tex.carga = FALSE
      
      UNION ALL
      
      SELECT
      mov.id AS id,
      'carga-bolsillo'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto * -1 AS monto
      FROM movimientos mov
      INNER JOIN transferencias_bolsillos tbo ON tbo.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tbo.carga = TRUE
      
      UNION ALL
      
      SELECT
      mov.id AS id,
      'descarga-bolsillo'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto AS monto
      FROM movimientos mov
      INNER JOIN transferencias_bolsillos tbo ON tbo.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tbo.carga = FALSE
      
      UNION ALL
      
      SELECT
      mov.id AS id,
      'inversion-cdt'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto * -1 AS monto
      FROM movimientos mov
      INNER JOIN transferencias_cdts tcd ON tcd.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tcd.tipo = 'inversion'
      
      UNION ALL
      
      SELECT
      mov.id AS id,
      'liquidacion-cdt'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto AS monto
      FROM movimientos mov
      INNER JOIN transferencias_cdts tcd ON tcd.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tcd.tipo = 'liquidacion'
      
      UNION ALL
      
      SELECT
      mov.id AS id,
      'cancelacion-cdt'::VARCHAR(30) AS tipo,
      mov.fecha AS fecha,
      mov.monto AS monto
      FROM movimientos mov
      INNER JOIN transferencias_cdts tcd ON tcd.movimiento = mov.id
      WHERE mov.cuenta = :idCuenta::INT AND tcd.tipo = 'cancelacion'
    ) movimientos
    ORDER BY movimientos.fecha DESC
    LIMIT 30;
    `,
      { replacements: { idCuenta }, type: QueryTypes.SELECT }
    );
    movimientos = movimientos.map((movimiento) => {
      return {
        ...movimiento,
        monto: parseFloat(movimiento.monto),
      };
    });
    return movimientos;
  },
};
