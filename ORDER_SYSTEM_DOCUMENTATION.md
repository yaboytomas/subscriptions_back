# Order Management System - Data Model & API Documentation

## Overview
This system implements a comprehensive order management solution where users (owners/employees) can create and manage work orders for clients. The system maintains relationships between Users, Clients, and Orders.

## Data Models

### 1. User Model
Represents system users (owners, managers, technicians)
- **Fields**: name, email, password, resetPasswordToken, resetPasswordExpires
- **Relationships**: 
  - One-to-many with Orders (as creator)
  - One-to-many with Orders (as assignee)

### 2. Client Model  
Represents customers/companies that receive services
- **Fields**: name, email, phone, company, subscriptionRenewalDate, subscriptionAmount, notes
- **Relationships**: 
  - One-to-many with Orders
  - Virtual field `orders` to access all client orders

### 3. Order Model (NEW)
Represents work orders/service requests
- **Fields**: 
  - Basic: orderNumber, title, description, category, priority, status
  - Relationships: client (ref), createdBy (ref), assignedTo (ref)
  - Financial: estimatedCost, actualCost
  - Time: estimatedDuration, actualDuration, scheduledDate, completedDate, dueDate
  - Materials: array of {name, quantity, cost}
  - Notes: notes (client-visible), internalNotes (internal only)
  - Tracking: statusHistory, attachments

## API Endpoints

### Order Management

#### Create Order
```
POST /orders
Headers: Authorization: Bearer <token>
Body: {
  "client": "client_id",
  "title": "Server Maintenance",
  "description": "Monthly server maintenance and updates",
  "category": "maintenance",
  "priority": "medium",
  "estimatedCost": 150.00,
  "estimatedDuration": 4,
  "scheduledDate": "2025-08-10T10:00:00Z",
  "dueDate": "2025-08-15T17:00:00Z",
  "materials": [
    {"name": "Server cleaning kit", "quantity": 1, "cost": 25.00}
  ],
  "notes": "Client requested priority on database optimization",
  "assignedTo": "user_id"
}
```

#### Get All Orders (with filtering)
```
GET /orders?page=1&limit=10&status=pending&priority=high&client=client_id
Headers: Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- status: Filter by status
- priority: Filter by priority
- category: Filter by category
- client: Filter by client ID
- createdBy: Filter by creator
- assignedTo: Filter by assignee
- sortBy: Field to sort by (default: createdAt)
- sortOrder: asc/desc (default: desc)
```

#### Get Order by ID
```
GET /orders/:id
Headers: Authorization: Bearer <token>
```

#### Update Order
```
PUT /orders/:id
Headers: Authorization: Bearer <token>
Body: {
  "title": "Updated title",
  "status": "in-progress",
  "actualCost": 175.00,
  "actualDuration": 5
}
```

#### Update Order Status
```
PATCH /orders/:id/status
Headers: Authorization: Bearer <token>
Body: {
  "status": "completed",
  "comment": "Work completed successfully"
}
```

#### Delete Order
```
DELETE /orders/:id
Headers: Authorization: Bearer <token>
```

#### Get Orders by Client
```
GET /orders/client/:clientId?page=1&limit=10
Headers: Authorization: Bearer <token>
```

#### Get Order Statistics
```
GET /orders/stats
Headers: Authorization: Bearer <token>

Returns:
- Status distribution
- Priority distribution
- Recent orders
- Overdue orders count
```

### Enhanced Client Endpoints

#### Get Client with Orders
```
GET /clients/:id
Headers: Authorization: Bearer <token>

Returns client data with populated orders array
```

## Enumerations

### Order Categories
- `maintenance` - Regular maintenance work
- `repair` - Fixing broken equipment/systems
- `installation` - Installing new equipment/systems
- `consultation` - Advisory/consulting services
- `subscription` - Subscription-related work
- `other` - Other types of work

### Order Priorities
- `low` - Non-urgent work
- `medium` - Standard priority
- `high` - Important work
- `urgent` - Critical/emergency work

### Order Statuses
- `pending` - Order created, not started
- `in-progress` - Work in progress
- `completed` - Work finished
- `cancelled` - Order cancelled
- `on-hold` - Temporarily paused

## Workflow Example

1. **User Login**: Owner logs in to the system
2. **Create Client**: Owner creates/selects a client
3. **Create Order**: Owner fills out work order with client info
4. **Assign Work**: Order can be assigned to technician
5. **Track Progress**: Status updates throughout the work
6. **Complete**: Order marked as completed with actual costs/time

## Database Relationships

```
User (1) -----> (N) Order (created by)
User (1) -----> (N) Order (assigned to)
Client (1) ----> (N) Order
Order ---------> (N) StatusHistory
Order ---------> (N) Materials
Order ---------> (N) Attachments
```

## Benefits of This Model

1. **Cross-referenced data**: Users, clients, and orders are properly linked
2. **Complete audit trail**: Status history tracks all changes
3. **Flexible assignment**: Orders can be created by one user and assigned to another
4. **Material tracking**: Track materials used per order
5. **Financial tracking**: Estimated vs actual costs
6. **Time management**: Scheduled dates, due dates, completion tracking
7. **Priority management**: Urgent work can be prioritized
8. **Client history**: Easy access to all orders for a client

## Getting Started

1. Run the seed script to create sample data:
   ```bash
   node seedData.js
   ```

2. Login with sample credentials:
   - Email: owner@example.com, Password: password123
   - Email: manager@example.com, Password: password123  
   - Email: tech@example.com, Password: password123

3. Use the API endpoints to create and manage orders

This model provides a robust foundation for managing work orders while maintaining clear relationships between users, clients, and their service history.
