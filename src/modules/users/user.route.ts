import { Router } from 'express';
import * as UserController from './user.controller';
import { isAuthenticated } from '../../core/middleware/auth.middleware';
import validate from '../../core/middleware/validate.middleware';
import { changePasswordValidation, profileValidation, searchTermValidation } from './user.validation';
import handleMulterErrors from '../../core/middleware/multerError.middleware';
import { upload } from '../../config/upload.config';
import asyncWrapper from '../../core/utils/asyncWrapper.util';

const router = Router();

router.use(isAuthenticated);

router.get('/me', UserController.getProfile);
router.post('/change-password', validate(changePasswordValidation), UserController.changePassword);
router.post('/avatar', upload, handleMulterErrors, UserController.updateAvatar);
router.post('/me', validate(profileValidation), UserController.updateProfile);
router.get('/search/:searchTerm', validate(searchTermValidation), UserController.searchContacts);
router.get('/contacts', UserController.handleGetContactsFromDMList);

export default router;
