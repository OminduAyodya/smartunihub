const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUserProfile).put(updateUserProfile).delete(deleteUser);

module.exports = router;
