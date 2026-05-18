const express = require('express');
const router = express.Router();
const { addEmployee, getAllEmployees, searchEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, addEmployee);
router.get('/', auth, getAllEmployees);
router.get('/search', auth, searchEmployee);
router.put('/:id', auth, updateEmployee);
router.delete('/:id', auth, deleteEmployee);

module.exports = router;
