const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema(
  {
    targetRole: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    projectCount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
    },
    candidateLevel: {
      type: String,
    },
    strengths: {
      type: [String],
      default: [],
    },
    gaps: {
      type: [String],
      default: [],
    },
    altPaths: {
      type: [String],
      default: [],
    },
    roadmap: {
      type: [String],
      default: [],
    },
    resumeName: {
      type: String,
    },
  },
  {
    timestamps: true,       // auto-adds createdAt and updatedAt
    collection: 'analyses', // explicit collection name
  }
)

module.exports = mongoose.model('Analysis', analysisSchema)
