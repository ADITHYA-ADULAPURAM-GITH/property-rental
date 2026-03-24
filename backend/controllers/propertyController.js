const Property = require('../models/Property');

// @desc    Get all available properties (with filters)
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const { city, minRent, maxRent, bedrooms, listingType, propertyType } =
      req.query;

    let filter = { isAvailable: true };

    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (listingType) filter.listingType = listingType;
    if (propertyType) filter.propertyType = propertyType;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    const properties = await Property.find(filter)
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'landlord',
      'name email phone'
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create property (landlord only)
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      rent,
      listingType,
      leaseDuration,
      securityDeposit,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      propertyType,
    } = req.body;

    const property = await Property.create({
      landlord: req.user._id,
      title,
      description,
      address,
      rent,
      listingType,
      leaseDuration,
      securityDeposit,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      propertyType,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property (landlord only)
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property (landlord only)
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get landlord's own properties
// @route   GET /api/properties/my-properties
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};