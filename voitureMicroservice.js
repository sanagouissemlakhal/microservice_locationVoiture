const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Voiture = require('./models/voitureModel');

const voitureProtoPath = 'voiture.proto';
const voitureProtoDefinition = protoLoader.loadSync(voitureProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const voitureProto = grpc.loadPackageDefinition(voitureProtoDefinition).voiture;

const url = 'mongodb://localhost:27017/voituresDB';

mongoose.connect(url)
    .then(() => {
        console.log('connected to database!');
    }).catch((err) => {
        console.log(err);
    });

const voitureService = {
    getVoiture: async (call, callback) => {
        try {
            const voitureId = call.request.voiture_id;
            const voiture = await Voiture.findOne({ _id: voitureId }).exec();
            if (!voiture) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Voiture not found' });
                return;
            }
            callback(null, { voiture });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching voiture' });
        }
    },
    searchVoitures: async (call, callback) => {
        try {
            const voitures = await Voiture.find({}).exec();
            callback(null, { voitures });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching voitures' });
        }
    },
    addVoiture: async (call, callback) => {
        const { marque, modele, couleur, description } = call.request;
        const newVoiture = new Voiture({ marque, modele, couleur, description });
        try {
            const savedVoiture = await newVoiture.save();
            callback(null, { voiture: savedVoiture });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding voiture' });
        }
    },
    updateVoiture: async (call, callback) => {
        const { id, marque, modele, couleur, description } = call.request;
        const _id = id;
        try {
            const updatedVoiture = await Voiture.findByIdAndUpdate(_id, { marque, modele, couleur, description }, { new: true });
            callback(null, { voiture: updatedVoiture });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while updating voiture' });
        }
    },
    deleteVoiture: async (call, callback) => {
        try {
            const voitureId = call.request.id;
            const deletedVoiture = await Voiture.findByIdAndDelete({ _id: voitureId });
            if (!deletedVoiture) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Voiture not found' });
                return;
            }
            callback(null, { voitures: deletedVoiture });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while deleting voiture' });
        }
    }
};

const server = new grpc.Server();
server.addService(voitureProto.VoitureService.service, voitureService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
});
console.log(`Voiture microservice is running on port ${port}`);
