const axios = require('axios');
const Employee = require('../models/Employee');

exports.getAIRecommendation = async (req, res) => {
    try {
        const { employeeId } = req.body;
        
        let employees = [];
        if (employeeId) {
            const emp = await Employee.findById(employeeId);
            if (!emp) return res.status(404).json({ msg: 'Employee not found' });
            employees.push(emp);
        } else {
            employees = await Employee.find();
        }

        if (employees.length === 0) {
            return res.status(404).json({ msg: 'No employees to analyze' });
        }

        // Construct prompt based on employees
        let promptText = "Analyze the following employee(s) and provide AI feedback. For each, give promotion suggestions, training suggestions, and improvement feedback. Also provide a ranking if there are multiple employees:\n\n";
        
        employees.forEach((emp, index) => {
            promptText += `Employee ${index + 1}: Name: ${emp.name}, Department: ${emp.department}, Skills: ${emp.skills.join(', ')}, Performance Score: ${emp.performanceScore}/100, Experience: ${emp.experience} years.\n`;
        });

        // Call OpenRouter API
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'minimax/minimax-m2.5:free', // Using the specified free model
            messages: [{ role: 'user', content: promptText }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content;

        res.json({ recommendation: aiResponse });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('AI Service Error');
    }
};
