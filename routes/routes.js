const express = require('express')
const { getUserByEmailAndPass } = require('../model/model')
const { routeProtector } = require('../helpers/auth')
const { getSchedules, signup } = require('../model/model')

const router = express.Router()

const indexGet = async (req, res) => {
  const data = await getSchedules()
  res.render('index', { schedules: data })
}
const loginGet = (req, res) => {
  if (req.session.user) return res.redirect('/')
  return res.render('login', { data: '' })
}
const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await getUserByEmailAndPass(email, password)
    req.session.user = { email, id: user[0].id }
    res.redirect('/')
  } catch (error) {
    res.render('login', { error })
  }
}

const logoutGet = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err)
    }
    return res.redirect('/login')
  })
}

const signupGet = async (req, res) => {
  res.render('signup')
}
const signupPost = async (req, res) => {
  try {
    await signup(req.body)
    res.redirect('/login')
  } catch (error) {
    res.render('signup', { error })
  }
}

router.get('/', indexGet)

router.get('/login', loginGet)
router.post('/login', loginPost)

router.get('/signup', signupGet)
router.post('/signup', signupPost)

router.get('/logout', logoutGet)

module.exports = router
