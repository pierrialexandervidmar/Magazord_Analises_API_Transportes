const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

require('./routes/index')(app);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})