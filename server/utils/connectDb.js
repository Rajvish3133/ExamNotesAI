import mongoose from 'mongoose';

export const connection =()=>{
    mongoose.connect(process.env.MONGODB_URL, {
     dbName: "AI_ExamNotes",
}).then(()=>{
    console.log("connected to database.")
}).catch(err=>{
    console.log(`Some error occured while connecting to database: ${err}`);
})
}

export default connection;