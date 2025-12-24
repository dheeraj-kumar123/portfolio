const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    username: { type: String, unique: true, sparse: true },
    personalInfo: {
      name: String,
      bio: String,
      image: String,
      title: String
    },
    skills: [
      {
        name: String,
        level: { type: Number, default: 50 }
      }
    ],
    projects: [
      {
        title: String,
        description: String,
        image: String,
        github: String,
        demo: String
      }
    ],
    education: [
      {
        school: String,
        degree: String,
        year: String,
        description: String
      }
    ],
    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String
      }
    ],
    contact: {
      email: String,
      phone: String,
      github: String,
      linkedin: String,
      website: String
    },
    theme: {
      template: { type: String, default: 'modern' },
      primaryColor: { type: String, default: '#8B5CF6' },
      font: { type: String, default: 'Inter' }
    },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
