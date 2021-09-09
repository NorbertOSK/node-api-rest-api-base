const { Router } = require("express");
const router = Router();

const {
  getUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  revalidateToken,
  forgotPassword,
  resetPassword,
} = require("./controller");

const {
  validateUser,
  validationOrderOfLogin,
  validateResetPassword,
} = require("./validate");

const checkToken = require("../../middlewares/checkToken");
const validateId = require("../../middlewares/validarId");

router.route("/") //no es necesaria esta ruta
  .get(getUsers);

router.route("/signup")
  .post(validateUser, createUser);
//registro deshabilitado!

router.route("/login")
  .post(validationOrderOfLogin, loginUser);

router.route("/update/:id") //probado | queda ver si es neesario buscar usuarios/
  .put(checkToken, validateId, updateUser);

router.route("/delete/:id") //probado | queda ver si es neesario buscar usuarios/
  .delete(checkToken, validateId, deleteUser);

router.route("/renew")
  .get(checkToken, revalidateToken);

router.route("/forgot-password") //genera enlace para recuperar contraseña
  .put(forgotPassword);

router.route("/reset-password") //para enviar password nuevo
  .put(validateResetPassword, resetPassword);

module.exports = router;
