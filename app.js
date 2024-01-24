// Backend (server.js)
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

async function generateUniqueCode() {
  // Generate a random 4-character string
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Generate a random 2-digit number
  const randomNumber = Math.floor(10 + Math.random() * 90);

  // Combine the string and number to create the final code
  const generatedCode = `${randomString}${randomNumber}`;

  // Check if the code already exists in the database
  const existingData = await Data.findOne({ code: generatedCode });

  // If it exists, recursively call the function to generate a new one
  if (existingData) {
    return generateUniqueCode();
  }

  return generatedCode;
}

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URI
);

const dataSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  location: Object,
  code: String,
  electricity: String,
  tole: String,
});

const Data = mongoose.model("Data", dataSchema);

app.post("/api/submitData", async (req, res) => {
  const { name, email, address, location, electricity, tole } = req.body;
  console.log(req.body);
  // Generate unique code (you need to implement this logic)
  const code = await generateUniqueCode();

  const newData = new Data({
    name,
    email,
    address,
    location,
    electricity,
    tole,
    code,
  });

  try {
    await newData.save();
    res.json({ success: true, code });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
