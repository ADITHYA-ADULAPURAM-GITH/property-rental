const Maintenance = require('../models/Maintenance');
const Rental = require('../models/Rental');

// @desc    Tenant raises a maintenance request
// @route   POST /api/maintenance
const createMaintenance = async (req, res) => {
  try {
    const { propertyId, title, description, priority, category, images } =
      req.body;

    // Check tenant has active rental for this property
    const rental = await Rental.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: 'active',
    });

    if (!rental) {
      return res.status(403).json({
        message: 'You must have an active rental to raise a maintenance request',
      });
    }

    const maintenance = await Maintenance.create({
      property: propertyId,
      tenant: req.user._id,
      landlord: rental.landlord,
      title,
      description,
      priority,
      category,
      images,
    });

    await maintenance.populate('property', 'title address');
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Landlord updates maintenance status
// @route   PUT /api/maintenance/:id
const updateMaintenance = async (req, res) => {
  try {
    const { status, landlordNote } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    if (maintenance.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    maintenance.status = status;
    if (landlordNote) maintenance.landlordNote = landlordNote;
    if (status === 'resolved') maintenance.resolvedAt = new Date();

    await maintenance.save();
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get maintenance requests for landlord
// @route   GET /api/maintenance/landlord
const getLandlordMaintenance = async (req, res) => {
  try {
    const requests = await Maintenance.find({ landlord: req.user._id })
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get maintenance requests for tenant
// @route   GET /api/maintenance/tenant
const getTenantMaintenance = async (req, res) => {
  try {
    const requests = await Maintenance.find({ tenant: req.user._id })
      .populate('property', 'title address')
      .populate('landlord', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone');

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMaintenance,
  updateMaintenance,
  getLandlordMaintenance,
  getTenantMaintenance,
  getMaintenance,
};