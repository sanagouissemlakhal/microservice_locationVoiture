const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Location = require('./models/locationModel');

const locationProtoPath = 'location.proto';
const locationProtoDefinition = protoLoader.loadSync(locationProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const locationProto = grpc.loadPackageDefinition(locationProtoDefinition).location;

const url = 'mongodb://localhost:27017/locationsDB';

mongoose.connect(url)
    .then(() => {
        console.log('Connected to database!');
    }).catch((err) => {
        console.log(err);
    });

const locationService = {
    getocation: async (call, callback) => {
        try {
            const locationId = call.request.location_id;
            const location = await ocation.findOne({ _id: locationId }).exec();
            if (!location) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Location not found' });
                return;
            }
            callback(null, { location });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching location' });
        }
    },
    searchLocations: async (call, callback) => {
        try {
            const Locations = await Locations.find({}).exec();
            callback(null, {locations });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching locations' });
        }
    },
    addLocation: async (call, callback) => {
        const { customer_id, start_date, end_date, price, car_id } = call.request;
        const newRLocation = new Location({ customer_id, start_date, end_date, price, car_id });
        try {
            const savedLocation = await newLocation.save();
            callback(null, { location: savedLocation });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding Location' });
        }
    }
};

const server = new grpc.Server();
server.addService(locationProto.LocationService.service, locationService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind server:', err);
        return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
});
console.log(`Location microservice is running on port ${port}`);
