
#  Required modules:

express: Express.js framework for building the server.

ApolloServer: Apollo Server for GraphQL implementation.

expressMiddleware: Middleware for Apollo Server with Express.js.


grpc: gRPC library for creating gRPC clients and servers.

protoLoader: Utility to load Protocol Buffer definitions



#   Loading Proto files:

The code loads two proto files: voiture.proto and location.proto using protoLoader.
#   Loading Proto files:
The code loads two proto files: voiture.proto and location.proto using protoLoader.
#Creating an Apollo Server:
 The code creates an Apollo Server instance with imported type definitions (typeDefs) and resolvers (resolvers).
# Applying Apollo Server middleware:
The Apollo Server middleware is applied to the Express application using expressMiddleware.
# Express routes:
The code defines several Express routes for handling RESTful API requests:

            GET /voitures: Fetches voiture using the jeanService gRPC .

            POST /voitures/add: Creates a new voiture using the voitureService gRPC .

            UPDATE /voitures/update/:id :updates a voiture using the voitureService gRPC. 

            DELETE /voitures/delete/:id: Deletes a voiture using the voitureService gRPC .

            GET /voitures/:id: Retrieves a voiture by ID using the voitureService gRPC .

            GET /locations: Fetches location using the locationService gRPC .

            POST /locations/add: Creates a new location using the locationService gRPC .

            GET /locations/:id: Retrieves a location by ID using the locationService gRPC .
# Starting the server:
 The Express application is started and listens on port 3000.
# Start each service:

   - API Gateway: ` nodemon apiGateway`

   - location Service: ` nodemon locationMicroservice`

  - Voiture Service: ` nodemon voitureMicroservice`

 
Please note that the provided code assumes the presence of the required dependencies, such as the proto files (voiture.proto and location.proto),
resolvers, and schema. Make sure you have those files available or modify the code accordingly.  
