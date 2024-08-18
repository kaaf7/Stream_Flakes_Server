const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    imdb_id: { type: String, required: false, unique: true },

    title: { type: String, required: false, unique: true },
    tagline: { type: String, required: false, unique: false },
    genres: { type: String, required: false, unique: false },

    vote_average: { type: Number, required: false, unique: false },
    vote_count: { type: Number, required: false, unique: false },

    revenue: { type: Number, required: false, unique: false },

    adult: { type: Boolean, required: false, unique: false },
    release_date: { type: Date, required: false, unique: false },
    runtime: { type: Number, required: false, unique: false },

    original_language: { type: String, required: false, unique: false },
    spoken_languages: { type: String, required: false, unique: false },

    production_companies: { type: String, required: false, unique: false },
    production_countries: { type: String, required: false, unique: false },

    poster_path: { type: String, required: false, unique: false },
    homepage: { type: String, required: false, unique: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
