const Cuenta = require("../models/Cuenta");

module.exports = {
  async crear(
    tipoIdentificacion,
    numeroIdentificacion,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    fechaNacimiento,
    correo,
    clave
  ) {
    const cuentaCreada = await Cuenta.create({
      tipoIdentificacion,
      numeroIdentificacion,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      correo,
      clave,
    });
    return cuentaCreada;
  },

  async buscarPorId(id) {
    const cuentaEncontrada = await Cuenta.findByPk(id);
    return cuentaEncontrada;
  },

  async buscarPorIdentificacion(tipoIdentificacion, numeroIdentificacion) {
    const cuentaEncontrada = await Cuenta.findOne({
      where: {
        tipoIdentificacion,
        numeroIdentificacion,
      },
    });
    return cuentaEncontrada;
  },

  async buscarPorCorreo(correo) {
    const cuentaEncontrada = await Cuenta.findOne({
      where: { correo },
    });
    return cuentaEncontrada;
  },
};
