const mongoose = require('mongoose');

mongoose.connect(
  process.env.SR_MONGO_URL, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);
mongoose.Promise = global.Promise;

module.exports = mongoose;