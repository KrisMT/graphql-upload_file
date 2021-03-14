const express = require('express');
const app = express();
const {ApolloServer} = require('apollo-server-express');
require('dotenv').config();

const typeDefs = require('./schema/typedefs');
const resolvers = require('./schema/resolvers');

let server = new ApolloServer({
    typeDefs, resolvers
});
server.applyMiddleware({app});

let PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server started on ${PORT}...`);
})
