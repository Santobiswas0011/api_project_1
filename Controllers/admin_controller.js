const { validationResult } = require('express-validator');
const { rmSync } = require('fs');
const path = require('path');
const ProductModel = require('../Model/Product');

exports.homePageController = (req, res) => {
  res.render('Admin/home_page', {
    title_page: "home page",
    pathName: '/'
  })
}

exports.adminController = (req, res) => {
  res.render('Admin/add_product', {
    title_page: "add_product",
    pathName: '/add_product',
    error:[]
  })
}

exports.productController = (req, res) => {
  const product_title = req.body.product_title;
  const product_price = req.body.product_price;
  const product_decs = req.body.product_decs;
  const product_image = req.file.path;

  let error = validationResult(req);
  if (!error.isEmpty()) {
    errorResponse = validationResult(req).array();
    console.log('ErrorResponse', errorResponse);
    return res.render('Admin/add_product', {
      title_page: "add_product",
      pathName: '/add_product',
      error: errorResponse
    })
  } else {
    const productData = new ProductModel({
      p_title: product_title,
      p_price: product_price,
      p_decs: product_decs,
      prodImage: product_image
    });
    productData.save().then(() => {
      console.log("Data is added");
    }).catch((err) => {
      console.log("Error to add data", err);
    })
    res.redirect('/productValue');
  }
}

exports.productValueController = (req, res) => {
  ProductModel.find().sort({ p_title: 1 })
    .then((Products) => {
          return res.status(201).json({
            success:true,
            message:'Product fetched successfully',
            productArry: Products
          })
    }).catch((err) => {
      console.log("Error to fetch data", err);
    })

}

exports.editController = (req, res) => {

  const edit_id = req.params.edit_id;
  ProductModel.findById(edit_id)
    .then((Product) => {
      res.render('Admin/edit_page', {
        title_page: "Edit Page",
        data: Product,
        pathName: '/editPage/:edit_id'
      })
    }).catch((err) => {
      console.log(err);
    })

}

exports.postEdit = (req, res) => {
  const edit_title = req.body.product_title;
  const edit_price = req.body.product_price;
  const edit_decs = req.body.product_decs;
  const edit_id = req.body.prod_id;
  let editImage = '';
  const oldUrl = req.body.oldUrl;

  if (req.file === undefined) {
    editImage = oldUrl;
  } else {
    editImage = req.file.path;
  }

  ProductModel.findById(edit_id).then((updateData) => {
    updateData.p_title = edit_title;
    updateData.p_price = edit_price;
    updateData.p_decs = edit_decs;
    updateData.prodImage = editImage;
    return updateData.save()
      .then(() => {
        console.log("Edit product is save");
        res.redirect('/productValue');
      }).catch((err) => {
        console.log("Error to add data", err);
      })
  })

}

exports.deleteAdminProduct = (req, res) => {
  const product_id = req.params.delete_id;
  ProductModel.deleteOne({ _id: product_id })
    .then((result) => {
      console.log(result);
      res.redirect('/productValue')
    }).catch((err) => {
      console.log(err);
    })
}

exports.deletePostMethod = (req, res) => {
  const del_id = req.body.del_id;
  ProductModel.deleteOne({ _id: del_id })
    .then((result) => {
      console.log(result);
      res.redirect('/productValue')
    }).catch((err) => {
      console.log(err);
    })
}
