const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByClient,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { body, param } = require('express-validator');
const validation = require('../middleware/validation');

// Validation rules for creating an order
const createOrderValidation = [
  body('client')
    .isMongoId()
    .withMessage('Valid client ID is required'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['maintenance', 'repair', 'installation', 'consultation', 'subscription', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('estimatedCost')
    .optional()
    .isNumeric()
    .withMessage('Estimated cost must be a number'),
  body('estimatedDuration')
    .optional()
    .isNumeric()
    .withMessage('Estimated duration must be a number'),
  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid scheduled date format'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Valid assigned user ID is required')
];

// Validation rules for updating an order
const updateOrderValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['maintenance', 'repair', 'installation', 'consultation', 'subscription', 'other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'])
    .withMessage('Invalid status'),
  body('estimatedCost')
    .optional()
    .isNumeric()
    .withMessage('Estimated cost must be a number'),
  body('actualCost')
    .optional()
    .isNumeric()
    .withMessage('Actual cost must be a number'),
  body('estimatedDuration')
    .optional()
    .isNumeric()
    .withMessage('Estimated duration must be a number'),
  body('actualDuration')
    .optional()
    .isNumeric()
    .withMessage('Actual duration must be a number'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Valid assigned user ID is required')
];

// Validation for updating order status
const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters')
];

// Validation for MongoDB ObjectId parameters
const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID'),
];

const clientIdValidation = [
  param('clientId')
    .isMongoId()
    .withMessage('Invalid client ID'),
];

// Routes

// POST /api/orders - Create a new order
router.post('/', 
  auth, 
  createOrderValidation, 
  validation, 
  createOrder
);

// GET /api/orders - Get all orders with filtering and pagination
router.get('/', 
  auth, 
  getAllOrders
);

// GET /api/orders/stats - Get order statistics for dashboard
router.get('/stats', 
  auth, 
  getOrderStats
);

// GET /api/orders/:id - Get single order by ID
router.get('/:id', 
  auth, 
  mongoIdValidation, 
  validation, 
  getOrderById
);

// PUT /api/orders/:id - Update order
router.put('/:id', 
  auth, 
  mongoIdValidation, 
  updateOrderValidation, 
  validation, 
  updateOrder
);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', 
  auth, 
  mongoIdValidation, 
  updateStatusValidation, 
  validation, 
  updateOrderStatus
);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', 
  auth, 
  mongoIdValidation, 
  validation, 
  deleteOrder
);

// GET /api/orders/client/:clientId - Get orders by client
router.get('/client/:clientId', 
  auth, 
  clientIdValidation, 
  validation, 
  getOrdersByClient
);

module.exports = router;
