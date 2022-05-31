const express = require('express');
const admin_router = express.Router();
const { body } = require('express-validator');
const auth_check = require('../Middleware/isAuth');
const adminController_Import = require('../Controllers/admin_controller');

admin_router.get('/', adminController_Import.homePageController);
admin_router.get('/add_product', adminController_Import.adminController);

admin_router.post('/product', [
   body('product_title', 'Product Name length 3 to 12').isLength({ min: 3, max: 12 }),
   body('product_price', 'Enter Valid Porduct Price').matches('^(?=.*[0-9]).{1,10}$'),
   body('product_decs', 'Description length 3 to 50').isLength({ min: 3, max: 50 })
], adminController_Import.productController);

admin_router.get('/productValue', auth_check, adminController_Import.productValueController);
admin_router.get('/editPage/:edit_id', adminController_Import.editController);
admin_router.post('/editPage', adminController_Import.postEdit);
admin_router.get('/deletePage/:delete_id', adminController_Import.deleteAdminProduct);
admin_router.post('/delete', adminController_Import.deletePostMethod);

module.exports = admin_router;
