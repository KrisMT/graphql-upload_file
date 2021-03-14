const fs = require('fs');
const {v4: uuid} = require('uuid');

const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

const processUpload = async (file)=>{
    const {createReadStream, mimetype, encoding, filename} = await file;
    let path = "uploads/" + uuid() + filename;
    let stream = createReadStream();
    return new Promise((resolve,reject)=>{
        stream
            .pipe(fs.createWriteStream(path))
            .on("finish", ()=>{

                resolve({
                    success: true,
                    message: "Successfully Uploaded",
                    mimetype, filename, encoding, location: path
                })
            })
            .on("error", (err)=>{
                console.log("Error Event Emitted")
                reject({
                    success: false,
                    message: "Failed"
                })
            })
    })
}

const resolvers = {
    Mutation: {
        singleUploadLocal : async (_, args)=>{
            const ret = processUpload(args.file);
            pubsub.publish('UPLOAD_CREATED', {uploadCreated: ret});
            return ret;
        },
        multipleUploadLocal : async (_, args) =>{
            let obj =  (await Promise.all(args.files)).map(processUpload);
            console.log(obj);
            return obj;
        }
    },
    Subscription: {
        uploadCreated: {
            subscribe: () => pubsub.asyncIterator(['UPLOAD_CREATED']),
        }
    }
}

module.exports = resolvers;
