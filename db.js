const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/inotebook?directConnection=true";

const connectToMongo=async()=>{
    try {
        mongoose.connect(mongoURI);
            console.log('Connected to mongo Database successfully')
    } catch (error) {
        console.error('Having Error to Connection in mongo DataBase');
    }
}

module.exports=connectToMongo;