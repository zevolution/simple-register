module.exports = {
  host: process.env.SR_MAIL_HOST,
  port: process.env.SR_PORT,
  auth: {
    user: process.env.SR_MAIL_USER,
    pass: process.env.SR_MAIL_PASSWORD
  }
};