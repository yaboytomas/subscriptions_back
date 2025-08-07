const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Client = require('../models/Client');
const auth = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Simple validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      client,
      title,
      description,
      category,
      priority,
      estimatedCost,
      estimatedDuration,
      scheduledDate,
      dueDate,
      materials,
      notes,
      internalNotes,
      assignedTo
    } = req.body;

    // Validate required fields
    if (!client || !title || !description || !category || !priority) {
      return res.status(400).json({
        message: 'Client, title, description, category, and priority are required'
      });
    }

    // Verify client exists
    const clientExists = await Client.findById(client);
    if (!clientExists) {
      return res.status(404).json({
        message: 'Client not found'
      });
    }

    const order = new Order({
      client,
      createdBy: req.user.userId,
      assignedTo: assignedTo || req.user.userId,
      title,
      description,
      category,
      priority,
      estimatedCost,
      estimatedDuration,
      scheduledDate,
      dueDate,
      materials: materials || [],
      notes,
      internalNotes
    });

    await order.save();
    await order.populate(['client', 'createdBy', 'assignedTo']);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      client
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (client) filter.client = client;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('client', 'name email company')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders
      }
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('client')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Validation rules
const createOrderValidation = [
  body('client').isMongoId().withMessage('Valid client ID is required'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['maintenance', 'repair', 'installation', 'consultation', 'subscription', 'other']).withMessage('Invalid category'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid order ID')
];

// Routes
router.post('/', auth, createOrderValidation, validate, createOrder);
router.get('/', auth, getAllOrders);
router.get('/:id', auth, mongoIdValidation, validate, getOrderById);

module.exports = router;
