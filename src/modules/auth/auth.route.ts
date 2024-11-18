import { Router } from 'express';
import * as AuthController from './auth.controller';
import validate from '../../core/middleware/validate.middleware';
import { accountRecovery, loginValidation, otpValidation, resetPasswordValidation, signUpValidation } from './auth.validation';
import { isAuthenticated } from '../../core/middleware/auth.middleware';

const router = Router();

router.post('/login', validate(loginValidation), AuthController.login);
router.post('/signup', validate(signUpValidation), AuthController.signUp);
router.post('/forgot-password', validate(accountRecovery), AuthController.forgotPassword);
router.post('/verify-otp', validate(otpValidation), AuthController.verifyOTP);
router.post('/reset-password', isAuthenticated, validate(resetPasswordValidation), AuthController.changePassword);

export default router;
