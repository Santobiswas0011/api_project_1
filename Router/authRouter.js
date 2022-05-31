const express = require('express');

const { check, body } = require('express-validator');

const regRouter = express.Router();
const authContImport = require('../Controllers/authController');


regRouter.post('/registrationData', [
    body('firstName', 'Valid firstName here').isLength({ min: 3, max: 12 }),
    body('lastName', 'Valid lastName here').isLength({ min: 3, max: 12 }),
    check('email').isEmail().withMessage("Input valid eamil"),
    body('password', 'Enter valid password').matches('^(?=.*[A-Za-z0-9])(?=.*[!@#$&*]).{4,12}$')
], authContImport.regDataController);

// regRouter.get('/loginPage', authContImport.loginDisplay);

regRouter.post('/login', [
    check('Uemail').isEmail().withMessage("Enter valid eamil"),
    body('Upassword', 'Enter valid password').matches('^(?=.*[A-Za-z0-9])(?=.*[!@#$&*]).{4,12}$')
], authContImport.loginController);

// regRouter.get('/logOut', authContImport.userLogout);

module.exports = regRouter;
