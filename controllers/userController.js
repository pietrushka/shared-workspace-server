const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.updateMe = catchAsync(async (req, res, next) => {

  console.log("update me start")
  const {userId, username, email} = req.body

  const dataToChange = {}

  if(username) {
    dataToChange.username = username
  } else if (email) {
    dataToChange.email = email
  }

  const updatedUser = await User.findByIdAndUpdate(userId, dataToChange, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
})