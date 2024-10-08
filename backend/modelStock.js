const mongoose=require('mongoose');
const schema=mongoose.Schema({
    No:Number,
	Item:String,
    CostPrice:Number,
    Available:Number
});
module.exports=mongoose.model('electronics',schema);