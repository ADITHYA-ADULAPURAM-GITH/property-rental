const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    rent: {
      type: Number,
      required: [true, 'Rent amount is required'],
    },
    // Rent vs Lease feature
    listingType: {
      type: String,
      enum: ['rent', 'lease'],
      default: 'rent',
    },
    leaseDuration: {
      type: String,
      enum: ['6 months', '1 year', '2 years', 'flexible'],
      default: 'flexible',
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number, // in sq ft
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'studio', 'commercial'],
      default: 'apartment',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);