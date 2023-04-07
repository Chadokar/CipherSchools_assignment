const { Router } = require("express");
const authController = require("../controllers/authController");
const { checkUser } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.put("/updates/:userid", authController.update_user_put);
router.put("/password/:userid", authController.change_password);
router.get("/details/:userid", authController.get_details);
router.put("/updateimage/:userid", authController.uploadImage);

module.exports = router;
