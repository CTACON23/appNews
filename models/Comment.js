
const {Schema,Types,model} = require('mongoose')

const schema = new Schema({
    comment:{type: String,required:true},
    email:{type:String,required:true},
    username:{type:String,required:true},   
    post:{type:Types.ObjectId,ref:'Post'}  
})

module.exports = model('Comment',schema)