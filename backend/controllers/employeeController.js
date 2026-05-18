const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, department, skills, performanceScore, experience } = req.body;
        
        if (performanceScore === undefined || performanceScore === null) {
            return res.status(400).json({ msg: 'Validation error: Missing performance score' });
        }
        
        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ msg: 'Error: Duplicate email' });
        }

        employee = new Employee({ name, email, department, skills, performanceScore, experience });
        await employee.save();

        res.status(201).json({ msg: 'Employee stored successfully', employee });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.searchEmployee = async (req, res) => {
    try {
        const { department } = req.query;
        let query = {};
        if (department) {
            query.department = { $regex: new RegExp(department, 'i') };
        }
        const employees = await Employee.find(query);
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { performanceScore } = req.body;
        let employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });

        employee.performanceScore = performanceScore;
        await employee.save();
        res.json({ msg: 'Updated data shown', employee });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Employee removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
