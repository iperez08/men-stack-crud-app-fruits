// Here is where we import modules
// We begin by loading Express
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose, { mongo } from 'mongoose'
import Fruit from './models/fruit.js'

const app = express();

mongoose.connect(process.env.MONGODB_URI)

// read information from body of the request
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.get('/fruits', async (req, res) => {
  const fruits = await Fruit.find()
  console.log(fruits)
  res.render("fruits/index.ejs", { fruits } )
})

app.get("/fruits/new", async (req, res) => {
  res.render("fruits/new.ejs")
})

app.post("/fruits", async (req, res) => {
  // talk to DB through the model
  if (req.body.isReadyToEat) {
    req.body.isReadyToEat = true
  } else req.body.isReadyToEat = false
  await Fruit.create(req.body)
  res.redirect("/fruits")
})

// event listener that notifies you if server is connected to database
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

