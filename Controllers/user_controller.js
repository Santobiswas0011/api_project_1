
const ProductModel = require('../Model/Product');

exports.userValueDisplay = (req, res) => {
    ProductModel.find().then((products)=>{
        res.render('users/userProduct', {
            productArry: products,
            title_page: "User Page",
            pathName:'/userviews'
        })
    }).catch((err)=>{
         console.log(err);
    })

}
exports.viewProductShop=(req,res)=>{
     const product_id=req.params.prod_id;
     console.log(`Collected product id ${product_id}`);
     ProductModel.findById({_id:product_id})
     .then((Product)=>{
          console.log(`Product found by Id ${Product}`);
          res.render('users/productDetalis',{
               title_page:"Product details",
               pathName:'/shopProduct',
               data:Product
          })
     }).catch((err)=>{
          console.log(err);
     })
}

exports.searchDataDisplay=(req,res)=>{
       const search_name=req.body.search_name;
       ProductModel.find({p_title:search_name})
       .then((data)=>{
          res.render('users/userProduct',{
               title_page:"search page",
               pathName:'/searchData',
               productArry:data
          })
     }).catch((err)=>{
          console.log(err);
     })
}

exports.cartPageDisplay=(req,res)=>{
     ProductModel.find().then((data)=>{
            res.render('users/cartPage',{
                 title_page:'Cart product',
                 pathName:'/cart_product',
                 productArry:data
            })
     }).catch((err)=>{
           console.log(err);
     })
};

