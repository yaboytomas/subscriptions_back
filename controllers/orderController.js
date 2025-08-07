const Order = require('../models/Order');
const Client = require('../models/Client');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
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

    // Verify assigned user exists (if provided)
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({
          message: 'Assigned user not found'
        });
      }
    }

    const order = new Order({
      client,
      createdBy: req.user.userId, // Assuming user ID comes from auth middleware
      assignedTo: assignedTo || req.user.userId, // Default to creator if not specified
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

    // Populate the order with client and user details
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

// Get all orders with filtering and pagination
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      client,
      createdBy,
      assignedTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (client) filter.client = client;
    if (createdBy) filter.createdBy = createdBy;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('client', 'name email company')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));

    res.status(200).json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
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

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('client')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Set modifiedBy for status history tracking
    updateData.modifiedBy = req.user.userId;

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('client')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.status(200).json({
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get orders by client
exports.getOrdersByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        message: 'Client not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ client: clientId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments({ client: clientId });

    res.status(200).json({
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        company: client.company
      },
      orders,
      totalOrders
    });
  } catch (error) {
    console.error('Error getting orders by client:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({
        message: 'Status is required'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Add to status history
    order.statusHistory.push({
      status,
      changedBy: req.user.userId,
      comment
    });

    order.status = status;
    
    // Set completion date if status is completed
    if (status === 'completed') {
      order.completedDate = new Date();
    }

    await order.save();
    await order.populate(['client', 'createdBy', 'assignedTo']);

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get dashboard statistics
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Order.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentOrders = await Order.find()
      .populate('client', 'name company')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const overdueOrders = await Order.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    }).countDocuments();

    res.status(200).json({
      statusStats: stats,
      priorityStats,
      recentOrders,
      overdueOrders
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createOrder: exports.createOrder,
  getAllOrders: exports.getAllOrders,
  getOrderById: exports.getOrderById,
  updateOrder: exports.updateOrder,
  deleteOrder: exports.deleteOrder,
  getOrdersByClient: exports.getOrdersByClient,
  updateOrderStatus: exports.updateOrderStatus,
  getOrderStats: exports.getOrderStats
};
