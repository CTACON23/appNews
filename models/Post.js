const {Schema,model,Types} = require('mongoose')

const schema = new Schema({
    title:{type: String,required:true},
    description:{type: String,required:true},
    theme:{type: String,required:true},
    isApproved:{type:Boolean,default:false},
    owner:{type:Types.ObjectId,ref:'User'},
    date:{type:Date,default:Date.now}
})

module.exports = model('Post',schema)