const mongoose=require('mongoose');
require('dotenv').config();
const connectToMongo=async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI);
            console.log('Connected to mongo Database successfully')
    } catch (error) {
        console.error('Having Error to Connection in mongo DataBase');
    }
}

module.exports=connectToMongo;