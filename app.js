const http = require('http');
const express = require('express');
const app = express();
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

const typeDefs = require('./schema/typedefs');
const resolvers = require('./schema/resolvers');

let server = new ApolloServer({
    typeDefs, resolvers, subscriptions : {
        onConnect: (connectionParams, webSocket, context) => {
            console.log('Connected!')
        },
        onDisconnect: (webSocket, context) => {
            console.log('Disconnected!')
        },
        path: '/subscriptions',
    },
});
server.applyMiddleware({app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

let PORT = process.env.PORT || 5000;
httpServer.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Subscriptions on ws://localhost:${PORT}${server.subscriptionsPath}`);
})
