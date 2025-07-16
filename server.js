const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const gigRoutes = require("./routes/gigRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use(cors());
app.use(bodyParser.json());

app.use("/api/gigs", gigRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Gig Service is running on port ${PORT}`);
});
