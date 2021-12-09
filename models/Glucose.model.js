const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const GlucoseSchema = new Schema({
  value: { type: Number, required: true, maxlength: 3, trim: true },
  date: {
    type: String,
    // validate: /^([01]?\d|2[0-3]):([0-5]\d)$/,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  }
});

const GlucoseModel = model("Glucose", GlucoseSchema);

module.exports = GlucoseModel;
