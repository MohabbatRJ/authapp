import { Router } from "express";
import * as controller from '../controllers/appController.js'

const router = Router();

// POST Methods
router.route('/register').post(controller.register);
// router.route('/registerMail').post();
router.route('/authenticate').post((res, req) => {
    res.end();
});
router.route('/login').post(controller.login);

// GET Methods
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);

// PUT Methods
router.route('/updateUser').put(controller.updateUser);
router.route('/resetPassword').put(controller.resetPassword);

export default router;