import mongoose from 'mongoose'
import { DB_CLOUD } from '../config/config.js';
const connectDB  = async ()=>{
    console.log(DB_CLOUD);
    return await mongoose.connect(DB_CLOUD)
    .then(res=>console.log(`DB Connected successfully on .........`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB;