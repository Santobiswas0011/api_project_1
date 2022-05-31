const mongoose=require('mongoose');
const SchemaVar=mongoose.Schema;

const ProductSchema= new SchemaVar({
   p_title:{
       type:String,
       required:true
   },
   p_price:{
      type:Number,
      required:true
   },
   p_decs:{
      type:String,
      required:true
   },
   prodImage:{
      type:String,
      required:true
  }
})

module.exports=mongoose.model('Products',ProductSchema);
