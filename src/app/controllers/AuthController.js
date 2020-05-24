const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Mailer = require('../lib/Mailer');

const PasswordError = require('../errors/PasswordError');
const UserError = require('../errors/UserError');
const UserNotFound = require('../errors/UserNotFound');
const AppError = require('../errors/AppError');
const PasswordSmallError = require('../errors/PasswordSmallError');
const TokenError = require('../errors/TokenError');

const authConfig = require('../../config/auth');

const User = require('../models/User');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
};
module.exports = {
  async register(req, res, next) {
    const { name, email, password } = req.body;
    
    if (!email)
      throw new UserNotFound;

    if (await User.findOne({ email }))
      throw new UserError('User already exists');
    
    if (!password || password.length < 8)
      throw new PasswordSmallError;

    if (!name || name.length < 4)
      throw new UserError('The name must be at least 4 letters');

    const user = await User.create({ name, email, password });

    user.password = undefined;
    
    res.json({ 
      user,
      token: generateToken({ id: user.id })
    });
  },

  async authenticate(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user)
      throw new UserNotFound;
    
    if (!password || password.length <= 0) 
      throw new PasswordError('Password cannot be null or empty');

    if (!bcrypt.compareSync(password, user.password))
      throw new PasswordError('Invalid password');

    user.password = undefined;

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400,
    })

    res.json({ 
      user, 
      token: generateToken({ id: user.id}) });
  },
  
  async forgotPassword(req, res, next) {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      throw new UserNotFound;

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id,{
        '$set': {
          passwordResetToken: token,
          passwordResetExpire: now,
        }
    });

    Mailer.sendMail({
      from: process.env.SR_MAIL_SENDERR,
      to: `${user.name} <${user.email}>`,
      subject: 'Did you forget your password?',
      html: `Hi ${user.name}, use the following token to reset your password <b>${token}</b>`
    }, (err) => {
      if (err) {
        console.log('Failed to send email to reset password');
        throw new AppError;
      }
      
      return res.json();
    });
  },

  async resetPassword(req, res, next) {
    const { email, token, password } = req.body;

    if (!password || password.length < 8)
      throw new PasswordSmallError;
    
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpire');

    if (!user)
      throw new UserNotFound;
    
    if (token !== user.passwordResetToken)
      throw new TokenError('Token invalid');

    const now = new Date();
    if (now > user.passwordResetExpire)
      throw new TokenError('Token expired, repeat the process');
      
    user.password = password;
    user.passwordResetExpire = now;

    await user.save();

    res.json();
  },

  async lastChangePassword(req, res, next) {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId })
      .select('+passwordResetExpire');

    if (!user) 
      throw new UserNotFound;

    const lastChange = user.passwordResetExpire ? user.passwordResetExpire : null ;

    res.json({ lastChange: lastChange });
  }
}