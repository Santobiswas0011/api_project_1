require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 2369;
const hostName = '127.0.0.1';
const appServer = express();
const cors=require('cors');

const path = require('path');
const session = require('express-session');
const multer = require('multer');
const flash=require('connect-flash');

// const csurf=require('csurf');

const cookieParser=require('cookie-parser');

const userMOdel = require('./Model/authModel');

const admin_router = require('./Router/admin_router');
const users_router = require('./Router/user_router');
const auth_router = require('./Router/authRouter');

appServer.use(flash());

const mongodb_session = require('connect-mongodb-session')(session);

const storeValue = new mongodb_session({
       uri: 'mongodb+srv://santo:123456Sb@cluster0.annke.mongodb.net/MongooseProject',
       collection: 'my-session'
});

appServer.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false, store: storeValue }))

const mongoose = require('mongoose');

// let db_url = '?retryWrites=true&w=majority';

// const csurfProtention=csurf();

appServer.use(cookieParser());

appServer.use(express.urlencoded({ extended: true }));

appServer.set("view engine", "ejs");
appServer.set("views", "view");
appServer.use(express.static(path.join(__dirname, 'Public')));

appServer.use('/upload_image', express.static(path.join(__dirname, 'upload_image')));
// to store images

const fileStorage = multer.diskStorage({
       destination: (req, file, callback) => {
              callback(null,'upload_image')
       },
       filename: (req, file, callback) => {
              callback(null,file.originalname)
       }
});

const fileFilter = (req, file, callback) => {
       if (file.mimetype.includes("png") ||
              file.mimetype.includes("jpg") ||
              file.mimetype.includes("webp") ||
              file.mimetype.includes("jpeg")) {

              callback(null,true)
       } else {
              callback(null,false)
       }
}

appServer.use(multer({storage:fileStorage,
       fileFilter :fileFilter,limits:{fieldSize:1024*1024*5} }).single('addImage'));

 // cors
appServer.use((req,res,next)=>{
         res.setHeader('Access-Control-Allow-Origin','*');
         res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
         res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
         next();
});

appServer.use(cors());

// session
appServer.use((req, res, next) => {
       if (!req.session.user) {
              return next();
       }
       userMOdel.findById(req.session.user._id).then((userValue) => {
              req.user = userValue;
              console.log("Users details", req.user);
              next();
       }).catch((err) => {
              console.log("User not found", err);
       })
});

// appServer.use(csurfProtention);


appServer.use((req,res,next)=>{
        res.locals.isAuthenticated=req.session.isLoggedIn;
       //  res.locals.csurf_token=req.csrfToken();
        next();
});

appServer.use(admin_router);
appServer.use(users_router);
appServer.use(auth_router);

appServer.use((req, res) => {
       res.end(`<h1> !!!! 404 is not found </h1>`)
});

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => {
              console.log("Database connected");
              appServer.listen(PORT, hostName, () => {
                     console.log(`Server is running at http://${hostName}:${PORT}`)
              });

       }).catch((err) => {
              console.log(err);
       });
