const Payment = require('../models/Payment');
const Rental = require('../models/Rental');

// @desc    Tenant makes a payment
// @route   POST /api/payments
const createPayment = async (req, res) => {
  try {
    const { rentalId, amount, month, paymentMethod, note } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    if (rental.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if payment for this month already exists
    const existing = await Payment.findOne({
      rental: rentalId,
      month,
      status: 'paid',
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: `Payment for ${month} already made` });
    }

    const payment = await Payment.create({
      rental: rentalId,
      tenant: req.user._id,
      landlord: rental.landlord,
      property: rental.property,
      amount,
      month,
      paymentMethod,
      note,
      status: 'paid',
      paidAt: new Date(),
    });

    await payment.populate('property', 'title address');
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments for tenant
// @route   GET /api/payments/tenant
const getTenantPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ tenant: req.user._id })
      .populate('property', 'title address')
      .populate('rental')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments for landlord
// @route   GET /api/payments/landlord
const getLandlordPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ landlord: req.user._id })
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .populate('rental')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rent due reminder - tenants who haven't paid this month
// @route   GET /api/payments/due/:month
const getRentDue = async (req, res) => {
  try {
    const { month } = req.params;

    // Get all active rentals for this landlord
    const activeRentals = await Rental.find({
      landlord: req.user._id,
      status: 'active',
    }).populate('tenant', 'name email phone')
      .populate('property', 'title');

    // Get paid rentals for this month
    const paidRentals = await Payment.find({
      landlord: req.user._id,
      month,
      status: 'paid',
    }).select('rental');

    const paidRentalIds = paidRentals.map((p) => p.rental.toString());

    // Filter unpaid
    const unpaid = activeRentals.filter(
      (r) => !paidRentalIds.includes(r._id.toString())
    );

    res.json(unpaid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getTenantPayments,
  getLandlordPayments,
  getRentDue,
};