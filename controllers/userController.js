const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.updateMe = catchAsync(async (req, res, next) => {
  const { userId, username, email } = req.body

  const dataToChange = {}

  if (!username && !email) return new AppError('Provide data to change', 400)

  if (username) {
    dataToChange.username = username
  } else if (email) {
    dataToChange.email = email
  }

  const updatedUser = await User.findByIdAndUpdate(userId, dataToChange, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})
