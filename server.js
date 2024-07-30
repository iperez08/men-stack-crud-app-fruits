// Here is where we import modules
// We begin by loading Express
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose, { mongo } from 'mongoose'
import methodOverride from "method-override"
import logger from "morgan"
import Fruit from './models/fruit.js'

const app = express();

mongoose.connect(process.env.MONGODB_URI)

// read information from body of the request
app.use(express.urlencoded({ extended: false }))
// override post and get methods to delete or put methods
app.use(methodOverride("_method"))
app.use(logger("dev"))

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.get('/fruits', async (req, res) => {
  const fruits = await Fruit.find()
  res.render("fruits/index.ejs", { fruits } )
})

app.get("/fruits/new", async (req, res) => {
  res.render("fruits/new.ejs")
})

app.get("/fruits/:fruitID", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitID)
  res.render("fruits/show.ejs", { fruit: foundFruit })
})

app.post("/fruits", async (req, res) => {
  // talk to DB through the model
  if (req.body.isReadyToEat) {
    req.body.isReadyToEat = true
  } else req.body.isReadyToEat = false
  await Fruit.create(req.body)
  res.redirect("/fruits")
})

app.delete("/fruits/:fruitID", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitID)
  res.redirect("/fruits")
})

app.get("/fruits/:fruitID/edit", async (req, res) => {
  const fruit = await Fruit.findById(req.params.fruitID)
  res.render("fruits/edit.ejs", { fruit: fruit })
})

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat) {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});


// event listener that notifies you if server is connected to database
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

