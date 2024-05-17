const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
type Voiture {
id: String!
marque : String!
modele : String!
couleur : String!
description: String!
}
type Location {
id: String!
customer_id : String!
start_date : String!
end_date : String!
price : String!
car_id : String!
}
type Query {
voiture(id: String!): Voiture
voitures: [Voiture]
location(id: String!): Location
locations: [Location]
addVoiture(marque : String!,modele : String!,couleur : String!,description: String!): Voiture
addLocation(customer_id : String!,start_date : String!,end_date : String!,price : String!,car_id : String!): Location

}
`;
module.exports = typeDefs