import { Router } from 'express';
import * as MessageController from './message.controller';
import { isAuthenticated } from '../../core/middleware/auth.middleware';
import validate from '../../core/middleware/validate.middleware';
import { userIdValidation } from '../users/user.validation';

const router = Router();

router.use(isAuthenticated);

router.get('/:userId', validate(userIdValidation), MessageController.handleGetMessages);

export default router;
