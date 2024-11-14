const express = require('express')
const app = express();

const fileUpload = require('express-fileupload');
const { cloudinaryConnect } = require('./config/cloudinary');
const PORT = process.env.PORT || 4000
const userRoutes = require('./routes/user.routes')
const courseRoutes = require('./routes/course.routes')
const profileRoutes = require('./routes/profile.routes')
const paymentRoutes = require('./routes/payment.routes')
// const contactRoutes = require('./routes/contact.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors') // to entertain frontend

require('./config/mongoose').connect()
require('dotenv').config()

app.use(express.json());
app.use(cookieParser());
app.use(
     cors({
          origin:"http://localhost:3000",
     })
)
app.use(fileUpload({
     useTempFiles:true,
     tempFileDir:'/tmp'
}))

cloudinaryConnect();

app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/payment',paymentRoutes);
// app.use('/api/v1/contact',contactRoutes);

app.get('/',(req,res)=>{
     return res.json({
          success:true,
          msg:'Your server is running ..'
     })
})

app.listen(PORT, () => console.log(`Server running at Port ${PORT}`));