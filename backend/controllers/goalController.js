/* When using mongoose to interact w/db 
it returns a promise, can use async/await or .then().
If use .then have to use .catch - 
use async/await use try/catch - 
if don't want to use try/catch & use errorHandler,
can use package express-async-handler
 */
const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')

/* @desc    Get goals
   @route   Get /api/goals
   @access  Private 
 */
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find()

  res.status(200).json(goals)
})

/* @desc    Set goal
   @route   POST /api/goals
   @access  Private 
 */
const setGoal = asyncHandler(async (req, res) => {
  // console.log(req.body)
  if (!req.body.text) {
    res.status(400)
    // uses express error handler, which returns html page
    throw new Error('Please add a text field')
  }

  const goal = await Goal.create({
    text: req.body.text
  })

  res.status(200).json(goal)
})

/* @desc    Update goal
   @route   PUT /api/goals/:id
   @access  Private 
 */
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)
  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }) // new option creates if doesn't exists

  // console.log(updatedGoal)
  res.status(200).json(updatedGoal)
})

/* @desc    Delete goal
   @route   DELETE /api/goals/:id
   @access  Private 
 */
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  await Goal.findByIdAndDelete(req.params.id)

  res.status(200).json({ id: req.params.id })
})

module.exports = { getGoals, setGoal, updateGoal, deleteGoal }
