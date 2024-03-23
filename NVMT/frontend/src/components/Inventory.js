import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css'; 

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    price: 0,
    categoryId: '',
    threshold_quantity: 0,
    unit_of_measurement: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryResponse, categoryResponse] = await Promise.all([
          axios.get('http://localhost:3000/inventory'),
          axios.get('http://localhost:3000/categories'),
        ]);
        setInventoryItems(inventoryResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/categories', { name: newCategoryName });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding new category: ', error);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/inventory', newItem);
      setInventoryItems([...inventoryItems, response.data]);
      setNewItem({ name: '', quantity: 0, price: 0, categoryId: '', threshold_quantity: 0, unit_of_measurement: '' });
    } catch (error) {
      console.error('Error adding new item: ', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="inventoryPageContainer">
      <div className="categoryColumn">
        <div className="categoryCreation">
          <h3>Create New Category</h3>
          <form onSubmit={handleCategorySubmit}>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="submit">Add Category</button>
          </form>
        </div>
      </div>
      <div className="inventoryColumn">
        <h3>Inventory on Hand</h3>
        <ul>
          {inventoryItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} {item.unit_of_measurement} - ${item.price}
            </li>
          ))}
        </ul>
      </div>
      <div className="itemColumn">
        <h3>Add Inventory Item</h3>
        <form onSubmit={handleItemSubmit}>
          <select
            value={newItem.categoryId}
            onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Threshold Quantity"
            value={newItem.threshold_quantity}
            onChange={(e) => setNewItem({ ...newItem, threshold_quantity: parseInt(e.target.value, 10) })}
          />
          <input
            type="text"
            placeholder="Unit of Measurement (e.g., kg, lbs , oz)"
            value={newItem.unit_of_measurement}
            onChange={(e) => setNewItem({ ...newItem, unit_of_measurement: e.target.value })}
          />
          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default Inventory;

