
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const app = express();

app.use(cors());

// Sample product data
let products = [
  { id: 1, name: 'Laptop', price: 80000 },
  { id: 2, name: 'Mobile', price: 40000 },
  { id: 3, name: 'Keyboard', price: 3000 }
];

// GraphQL Schema
const schema = buildSchema(`
  type Product {
    id: Int
    name: String
    price: Float
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(name: String, price: Float): Product
  }
`);

// Resolvers
const root = {
  products: () => products,

  addProduct: ({ name, price }) => {
    const newProduct = {
      id: products.length + 1,
      name: name,
      price: price
    };

    products.push(newProduct);

    return newProduct;
  }
};

// GraphQL Server
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Start Server
app.listen(5000, () => {
  console.log('GraphQL API running at http://localhost:5000/graphql');
});
