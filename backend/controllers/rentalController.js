const Rental = require('../models/Rental');
const Property = require('../models/Property');

// @desc    Tenant requests to rent a property
// @route   POST /api/rentals
const createRental = async (req, res) => {
  try {
    const { propertyId, requestMessage, startDate, endDate } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.isAvailable) {
      return res.status(400).json({ message: 'Property is not available' });
    }

    // Check if tenant already has a pending/active request for this property
    const existing = await Rental.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: { $in: ['pending', 'active'] },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: 'You already have an active request for this property' });
    }

    const rental = await Rental.create({
      property: propertyId,
      tenant: req.user._id,
      landlord: property.landlord,
      monthlyRent: property.rent,
      listingType: property.listingType,
      leaseDuration: property.leaseDuration,
      securityDeposit: property.securityDeposit,
      requestMessage,
      startDate,
      endDate,
    });

    await rental.populate('property', 'title address');
    await rental.populate('tenant', 'name email');

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Landlord approves or rejects rental request
// @route   PUT /api/rentals/:id/status
const updateRentalStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    if (rental.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    rental.status = status;
    if (rejectionReason) rental.rejectionReason = rejectionReason;

    // Mark property unavailable if approved
    if (status === 'active') {
      await Property.findByIdAndUpdate(rental.property, {
        isAvailable: false,
      });
    }

    // Mark property available again if terminated
    if (status === 'terminated') {
      await Property.findByIdAndUpdate(rental.property, {
        isAvailable: true,
      });
    }

    await rental.save();
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rentals for landlord
// @route   GET /api/rentals/landlord
const getLandlordRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ landlord: req.user._id })
      .populate('property', 'title address images')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rentals for tenant
// @route   GET /api/rentals/tenant
const getTenantRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ tenant: req.user._id })
      .populate('property', 'title address images rent')
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single rental
// @route   GET /api/rentals/:id
const getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('property', 'title address images rent')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone');

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRental,
  updateRentalStatus,
  getLandlordRentals,
  getTenantRentals,
  getRental,
};