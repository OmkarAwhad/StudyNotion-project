const mongoose = require('mongoose')
require('dotenv').config();

exports.connect = () => {
     mongoose.connect(process.env.DB_URL)
     .then(()=> console.log("DB connected"))
     .catch((e) => {
          console.log(e);
          process.exit(1);
     })
}
