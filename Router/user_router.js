const express=require('express');
const users_router=express.Router();
const userControllerImport=require('../Controllers/user_controller');

users_router.get('/userviews',userControllerImport.userValueDisplay);
users_router.get('/shopProduct/:prod_id',userControllerImport.viewProductShop);
users_router.post('/searchData',userControllerImport.searchDataDisplay);

users_router.get('/cart_product/:cart_id',userControllerImport.cartPageDisplay)

module.exports=users_router;
