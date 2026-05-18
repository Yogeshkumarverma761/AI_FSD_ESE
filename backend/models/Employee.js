const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    skills: { type: [String], required: true },
    performanceScore: { type: Number, required: true },
    experience: { type: Number, required: true }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
