
import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';

const endpoint = 'http://localhost:5000/graphql';

// Fetch products
const query = gql`
  {
    products {
      id
      name
      price
    }
  }
`;

// Add product
const mutation = gql`
  mutation AddProduct($name: String, $price: Float) {
    addProduct(name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Fetch products when page loads
  const fetchProducts = async () => {
    const data = await request(endpoint, query);
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || price === '' || Number(price) < 0) {
      alert('Please enter a valid product name and price');
      return;
    }

    await request(endpoint, mutation, {
      name: name,
      price: Number(price)
    });

    fetchProducts();

    setName('');
    setPrice('');
  };

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Arial',
      textAlign: 'center'
    }}>
      <h1>GraphQL Product Management</h1>

      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="any"
          required
        />

        <button type="submit">Add Product</button>
      </form>

      <h2>Product List</h2>

      <table border="1" cellPadding="10"
        style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price (PKR)</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
