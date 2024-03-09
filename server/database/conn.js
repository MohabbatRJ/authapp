import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";
import ENV from '../config.js'
async function connect(){
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

    // mongoose.set('strictQuery', true);
    // for local memoryStorage
    // const db = await mongoose.connect(getUri);

    // for database live 
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log('Database connect');

    return db;
}

export default connect