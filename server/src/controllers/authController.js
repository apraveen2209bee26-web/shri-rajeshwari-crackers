import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const buildAuthResponse = (user) => ({
  token: generateToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    companyName: user.companyName,
    institutionName: user.institutionName,
    bio: user.bio,
    defaultAddress: user.defaultAddress,
  },
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, companyName, institutionName, bio } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    companyName,
    institutionName,
    bio,
    role: 'user',
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    ...buildAuthResponse(user),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.role !== 'user') {
    res.status(403);
    throw new Error('Use the admin login for administrator access');
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Logged in successfully',
    ...buildAuthResponse(user),
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  if (user.role !== 'admin') {
    res.status(403);
    throw new Error('This account is not an administrator');
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Admin logged in successfully',
    ...buildAuthResponse(user),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      companyName: req.user.companyName,
      institutionName: req.user.institutionName,
      bio: req.user.bio,
      defaultAddress: req.user.defaultAddress,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, companyName, institutionName, bio, defaultAddress } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.companyName = companyName ?? user.companyName;
  user.institutionName = institutionName ?? user.institutionName;
  user.bio = bio ?? user.bio;
  if (defaultAddress) {
    user.defaultAddress = defaultAddress;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      companyName: user.companyName,
      institutionName: user.institutionName,
      bio: user.bio,
      defaultAddress: user.defaultAddress,
    },
  });
});

export { registerUser, loginUser, loginAdmin, getCurrentUser, updateProfile };
