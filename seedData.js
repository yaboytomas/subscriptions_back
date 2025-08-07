const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Client = require('./models/Client');
const Order = require('./models/Order');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Client.deleteMany({});
    await Order.deleteMany({});
    
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Owner',
        email: 'owner@example.com',
        password: 'password123'
      },
      {
        name: 'Jane Manager',
        email: 'manager@example.com',
        password: 'password123'
      },
      {
        name: 'Bob Technician',
        email: 'tech@example.com',
        password: 'password123'
      }
    ]);

    console.log('Created sample users');

    // Create sample clients
    const clients = await Client.create([
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '555-0101',
        company: 'Acme Corp',
        subscriptionRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subscriptionAmount: 299.99,
        notes: 'Premium client with monthly maintenance contract'
      },
      {
        name: 'Tech Innovations LLC',
        email: 'info@techinnovations.com',
        phone: '555-0102',
        company: 'Tech Innovations LLC',
        subscriptionRenewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        subscriptionAmount: 199.99,
        notes: 'New client, recently signed up'
      },
      {
        name: 'Global Solutions Inc',
        email: 'support@globalsolutions.com',
        phone: '555-0103',
        company: 'Global Solutions Inc',
        subscriptionRenewalDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        subscriptionAmount: 499.99,
        notes: 'Enterprise client with custom requirements'
      }
    ]);

    console.log('Created sample clients');

    // Create sample orders
    const orders = await Order.create([
      {
        client: clients[0]._id,
        createdBy: users[0]._id,
        assignedTo: users[2]._id,
        title: 'Server Maintenance',
        description: 'Monthly server maintenance and updates for the main production server',
        category: 'maintenance',
        priority: 'medium',
        status: 'in-progress',
        estimatedCost: 150.00,
        estimatedDuration: 4,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        materials: [
          { name: 'Server cleaning kit', quantity: 1, cost: 25.00 },
          { name: 'Backup drives', quantity: 2, cost: 50.00 }
        ],
        notes: 'Client requested priority on database optimization'
      },
      {
        client: clients[1]._id,
        createdBy: users[0]._id,
        assignedTo: users[1]._id,
        title: 'Network Setup',
        description: 'Install and configure new network infrastructure for office expansion',
        category: 'installation',
        priority: 'high',
        status: 'pending',
        estimatedCost: 800.00,
        estimatedDuration: 16,
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        materials: [
          { name: 'Network cables', quantity: 10, cost: 100.00 },
          { name: 'Network switches', quantity: 2, cost: 300.00 },
          { name: 'Access points', quantity: 3, cost: 450.00 }
        ],
        notes: 'Client needs this completed before new employees start'
      },
      {
        client: clients[2]._id,
        createdBy: users[1]._id,
        assignedTo: users[2]._id,
        title: 'Security Audit',
        description: 'Comprehensive security audit of all systems and network infrastructure',
        category: 'consultation',
        priority: 'urgent',
        status: 'completed',
        estimatedCost: 1200.00,
        actualCost: 1150.00,
        estimatedDuration: 24,
        actualDuration: 22,
        completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        materials: [
          { name: 'Security scanning tools', quantity: 1, cost: 200.00 }
        ],
        notes: 'Audit completed successfully, report delivered to client',
        internalNotes: 'Client was very satisfied with the thoroughness of the audit'
      },
      {
        client: clients[0]._id,
        createdBy: users[0]._id,
        assignedTo: users[2]._id,
        title: 'Emergency Repair',
        description: 'Urgent repair of main database server that went down during business hours',
        category: 'repair',
        priority: 'urgent',
        status: 'on-hold',
        estimatedCost: 300.00,
        estimatedDuration: 6,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        materials: [
          { name: 'Replacement hard drive', quantity: 1, cost: 150.00 }
        ],
        notes: 'Waiting for replacement parts to arrive',
        internalNotes: 'Parts ordered, should arrive tomorrow morning'
      },
      {
        client: clients[1]._id,
        createdBy: users[1]._id,
        assignedTo: users[1]._id,
        title: 'Software License Renewal',
        description: 'Renew and update software licenses for office productivity suite',
        category: 'subscription',
        priority: 'low',
        status: 'pending',
        estimatedCost: 500.00,
        estimatedDuration: 2,
        scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        notes: 'Licenses expire at end of month'
      }
    ]);

    console.log('Created sample orders');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Created ${users.length} users:`);
    users.forEach(user => console.log(`- ${user.name} (${user.email})`));
    
    console.log(`\nCreated ${clients.length} clients:`);
    clients.forEach(client => console.log(`- ${client.name} (${client.company})`));
    
    console.log(`\nCreated ${orders.length} orders:`);
    orders.forEach(order => console.log(`- ${order.title} (${order.status}) - Priority: ${order.priority}`));

    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('You can log in with any of these accounts:');
    console.log('Email: owner@example.com, Password: password123');
    console.log('Email: manager@example.com, Password: password123');
    console.log('Email: tech@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

connectDB().then(() => {
  seedData();
});
