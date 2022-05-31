const mongoose=require('mongoose');
const schemaVar=mongoose.Schema;

const registratinSchema=new schemaVar({
   firstName:{
       type:String,
       required:true
   },
   lastName:{
       type:String,
       required:true
   },
   email:{
       type:String,
       required:true
   },
   password:{
       type:String,
       required:true
   }

});

module.exports=mongoose.model('RegisterData',registratinSchema);
