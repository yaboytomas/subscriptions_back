const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: function() {
        return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      }
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be assigned later
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['maintenance', 'repair', 'installation', 'consultation', 'subscription', 'other'],
      default: 'other'
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
      default: 'pending'
    },
    estimatedCost: {
      type: Number,
      required: false,
      min: 0,
    },
    actualCost: {
      type: Number,
      required: false,
      min: 0,
    },
    estimatedDuration: {
      type: Number, // in hours
      required: false,
      min: 0,
    },
    actualDuration: {
      type: Number, // in hours
      required: false,
      min: 0,
    },
    scheduledDate: {
      type: Date,
      required: false,
    },
    completedDate: {
      type: Date,
      required: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    materials: [{
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      cost: {
        type: Number,
        required: false,
        min: 0,
      }
    }],
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    internalNotes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    attachments: [{
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    // History tracking
    statusHistory: [{
      status: {
        type: String,
        required: true,
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
      comment: String
    }]
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
orderSchema.index({ client: 1, createdAt: -1 });
orderSchema.index({ createdBy: 1, createdAt: -1 });
orderSchema.index({ status: 1, priority: 1 });
orderSchema.index({ orderNumber: 1 });

// Middleware to automatically add status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this.modifiedBy || this.createdBy, // You'll need to set modifiedBy in your controller
      changedAt: new Date()
    });
  }
  next();
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Days
});

// Virtual for if order is overdue
orderSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

module.exports = mongoose.model('Order', orderSchema);
