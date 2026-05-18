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

        // Robust model rotation/fallbacks (incase one is rate-limited or down)
        const models = [
            'openai/gpt-oss-120b:free',
            'google/gemini-2.5-flash:free',
            'meta-llama/llama-3.3-70b-instruct:free',
            'minimax/minimax-m2.5:free',
            'deepseek/deepseek-r1:free'
        ];

        let aiResponse = null;
        let lastError = null;

        for (const model of models) {
            try {
                console.log(`Attempting to generate insights using OpenRouter model: ${model}`);
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: model,
                    messages: [{ role: 'user', content: promptText }]
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://render.com',
                        'X-Title': 'AI Employee Performance Tracker'
                    },
                    timeout: 10000 // 10 second timeout per model attempt
                });

                if (response.data?.choices?.[0]?.message?.content) {
                    aiResponse = response.data.choices[0].message.content;
                    console.log(`Successfully generated insights using model: ${model}`);
                    break;
                }
            } catch (err) {
                console.error(`Failed using model ${model}:`, err.response?.data || err.message);
                lastError = err.response?.data || err.message;
            }
        }

        if (!aiResponse) {
            const errorMsg = lastError?.message || lastError?.error?.message || JSON.stringify(lastError) || 'Unknown OpenRouter Error';
            return res.status(500).json({ 
                msg: `AI Service Error: ${errorMsg}. Please check that OPENROUTER_API_KEY is correctly set in your Render environment variables.`
            });
        }

        res.json({ recommendation: aiResponse });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('AI Service Error');
    }
};
