const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto files for voiture and location 
const voitureProtoPath = 'voiture.proto';

const locationProtoPath = 'location.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Create a new Express application
const app = express();
const voitureProtoDefinition = protoLoader.loadSync(voitureProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const locationProtoDefinition = protoLoader.loadSync(locationProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
app.use(bodyParser.json());
const voitureProto = grpc.loadPackageDefinition(voitureProtoDefinition).voiture;
const locationProto = grpc.loadPackageDefinition(locationProtoDefinition).location;

// Create ApolloServer instance with imported schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Apply ApolloServer middleware to Express application
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});

app.get('/voitures', (req, res) => {
    const client = new voitureProto.VoitureService('localhost:50051',
        grpc.credentials.createInsecure());
    client.searchVoitures({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.voitures);
        }
    });
});

app.get('/voitures/:id', (req, res) => {
    const client = new voitureProto.VoitureService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getVoiture({ voiture_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.voiture);
        }
    });
});

app.post('/voitures/add', (req, res) => {
    const client = new voitureProto.VoitureService('localhost:50051',
        grpc.credentials.createInsecure());
    const data = req.body;
    const marque = data.marque;
    const modele = data.modele;
    const couleur = data.couleur;
    const desc = data.description;
    client.addVoiture({ marque: marque, modele: modele, couleur: couleur, description: desc }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.voiture);
        }
    });
});

app.put('/voitures/update/:id', (req, res) => {
    const client = new voitureProto.VoitureService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;   
    const data = req.body;
    const marque = data.marque;
    const modele = data.modele;
    const couleur = data.couleur;
    const desc = data.description;
    client.updateVoiture({ id: id, marque: marque, modele: modele, couleur: couleur, description: desc }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.voiture);
        }
    });
});

app.delete('/voitures/delete/:id', (req, res) => {
    const client = new voitureProto.VoitureService('localhost:50051',
        grpc.credentials.createInsecure());
    const voitureId = req.params.id; 
    client.deleteVoiture({ id: voitureId }, (err, response) => { 
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.voitures);
        }
    });
});

app.get('/locations', (req, res) => {
    const client = new locationProto.LocationService('localhost:50052',
        grpc.credentials.createInsecure());
    client.searchLocations({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.locations);
        }
    });
});

app.get('/locations/:id', (req, res) => {
    const client = new locationProto.LocationService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getLocation({ location_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.location);
        }
    });
});

app.post('/locations/add', (req, res) => {
    const client = new locationProto.LocationService('localhost:50052',
        grpc.credentials.createInsecure());
    const data = req.body;
    const customer_id = data.customer_id;
    const start_date = data.start_date;
    const end_date = data.end_date;
    const price = data.price;
    const car_id = data.car_id;
    client.addLocation({ customer_id: customer_id, start_date: start_date, end_date: end_date, price: price, car_id: car_id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.location);
        }
    });
});

// Start Express application
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
