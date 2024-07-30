// Here is where we import modules
// We begin by loading Express
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose, { mongo } from 'mongoose'
import Fruit from './models/fruit.js'

const app = express();

mongoose.connect(process.env.MONGODB_URI)

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.get("/fruits/new", async (req, res) => {
  res.render("fruits/new.ejs")
})

// event listener that notifies you if server is connected to database
mongoose.connection.on('connected', () =>{
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

