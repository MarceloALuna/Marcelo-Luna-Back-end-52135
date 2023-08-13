import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const messageCollection = 'message'

const messageSchema = new mongoose.Schema({
    
})

productSchema.plugin(mongoosePaginate)

const messagetModel = mongoose.model(messageCollection, messageSchema)

export default messageModel