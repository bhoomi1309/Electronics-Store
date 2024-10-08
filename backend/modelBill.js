const mongoose=require('mongoose');
const schema=mongoose.Schema({
    No:Number,
	CustomerName:String,
    Amount:Number,
    Profit:Number,
    date:String,
    ItemNames:[String],
    Quantities:[String],
    Price:[String]
});
module.exports=mongoose.model('bills',schema);