const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { limiter } = require('../middleware/rateLimiter');
const clientController = require('../controllers/clientController');

// Apply rate limiting and authentication to all routes
router.use(auth);
router.use(limiter);

router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.get('/email/:email', clientController.getClientByEmail);
router.put('/:id', clientController.updateClient);
router.patch('/:id', clientController.patchClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
