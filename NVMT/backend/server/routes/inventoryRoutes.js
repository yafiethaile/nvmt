const express = require('express');
const pool = require('../db');
const router = express.Router();

// Route to get all categories
router.get('/categories', async (req, res) => {
  try {
    const allCategories = await pool.query('SELECT * FROM categories');
    res.json(allCategories.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Route to add a new category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


router.post('/inventory', async (req, res) => {
  try {
    const { name, quantity, price, category_id, threshold_quantity, unit_of_measurement } = req.body;

    // Check if the item already exists in the inventory
    const existingItem = await pool.query(
      'SELECT * FROM inventory WHERE name = $1 AND category_id = $2',
      [name, category_id]
    );

    if (existingItem.rows.length > 0) {
      // If item exists, update its quantity
      const updatedQuantity = existingItem.rows[0].quantity + quantity;
      await pool.query(
        'UPDATE inventory SET quantity = $1 WHERE id = $2',
        [updatedQuantity, existingItem.rows[0].id]
      );
      res.json({ message: 'Inventory updated successfully' });
    } else {
      // If item does not exist, insert it
      const newInventoryItem = await pool.query(
        'INSERT INTO inventory (name, quantity, price, category_id, threshold_quantity, unit_of_measurement) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, quantity, price, category_id, threshold_quantity, unit_of_measurement]
      );

      // Check if the new item's quantity falls below the threshold
      if (quantity < threshold_quantity) {
        // Create a new order indicating that it's an automatic purchase order due to low inventory
        const newOrder = await pool.query(
          'INSERT INTO orders (total_amount, is_purchase_order) VALUES ($1, $2) RETURNING *',
          [(threshold_quantity - quantity) * price, true] 
        );

        // Add a new purchase order item linked to the newly created order
        await pool.query(
          'INSERT INTO purchase_order_items (inventory_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
          [newInventoryItem.rows[0].id, threshold_quantity - quantity, price, (threshold_quantity - quantity) * price]
        );
      }
      
      res.status(201).json(newInventoryItem.rows[0]);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Route to get all inventory items along with category names
router.get('/inventory', async (req, res) => {
  try {
    const allInventoryItems = await pool.query(
      'SELECT inventory.id, inventory.name, inventory.quantity, inventory.price, inventory.category_id, inventory.threshold_quantity, inventory.unit_of_measurement, categories.name AS category_name FROM inventory INNER JOIN categories ON inventory.category_id = categories.id'
    );
    res.json(allInventoryItems.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
