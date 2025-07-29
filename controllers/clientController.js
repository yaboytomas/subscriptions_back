const Client = require('../models/Client');
const sendEmail = require('../utils/sendEmail');
const { getWelcomeEmailTemplate } = require('../utils/emailTemplate');

exports.createClient = async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    subscriptionRenewalDate,
    subscriptionAmount,
    notes,
  } = req.body;
  try {
    if (
      !name ||
      !email ||
      !phone ||
      !company ||
      !subscriptionRenewalDate ||
      !subscriptionAmount
    ) {
      return res.status(400).json({
        message:
          'Name, email, phone, company, subscription renewal date, and subscription amount are required',
      });
    }

    let client = await Client.findOne({ email });
    if (client) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    client = new Client({
      name,
      email,
      phone,
      company,
      subscriptionRenewalDate,
      subscriptionAmount,
      notes,
    });
    await client.save();

    // Send welcome email with HTML template
    try {
      const htmlTemplate = getWelcomeEmailTemplate({
        name: client.name,
        company: client.company,
        subscriptionRenewalDate: client.subscriptionRenewalDate,
        subscriptionAmount: client.subscriptionAmount,
      });

      await sendEmail(
        email,
        `¡Bienvenido/a a Zabotech, ${name}!`,
        null, // No plain text - using HTML template only
        htmlTemplate
      );
      console.log(`Welcome email sent successfully to ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the entire operation if email fails
    }

    res.status(201).json({
      _id: client._id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      subscriptionRenewalDate: client.subscriptionRenewalDate,
      subscriptionAmount: client.subscriptionAmount,
      notes: client.notes,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    company,
    subscriptionRenewalDate,
    subscriptionAmount,
    notes,
  } = req.body;
  try {
    const client = await Client.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        company,
        subscriptionRenewalDate,
        subscriptionAmount,
        notes,
      },
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.patchClient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const client = await Client.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error patching client:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getClientByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
