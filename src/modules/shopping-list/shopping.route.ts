import { Router } from 'express';
import * as ShoppingListController from './shopping.controller';
import { isAuthenticated } from '../../core/middleware/auth.middleware';
import validate from '../../core/middleware/validate.middleware';
import { createShoppingListValidation } from './shopping.validation';

const router = Router();

router.use(isAuthenticated);

router.get('/',ShoppingListController.getMyLists);
router.post('/',validate(createShoppingListValidation), ShoppingListController.createNewList);
router.delete('/:id', ShoppingListController.destoryList);
router.put('/:id', validate(createShoppingListValidation), ShoppingListController.modifyList);

export default router;
