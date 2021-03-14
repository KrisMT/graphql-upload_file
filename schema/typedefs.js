const {gql} = require('apollo-server-express')

const typedefs = gql`
    type Query {
        uploadedFiles : [File]
    }
    type Mutation {
        singleUploadLocal (file: Upload!) : File
        multipleUploadLocal (files: [Upload]!) : [File]
    }
    type File {
        success : String!
        message : String!
        mimetype : String
        encoding : String
        filename : String
        location : String
    }
`;
module.exports = typedefs;
