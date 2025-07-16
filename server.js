const express = require("express");
const cors = require("cors");
// const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const gigRoutes = require("./routes/gigRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use(
    cors({
        origin: "*", // Allow all origins for simplicity, adjust as needed
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);
app.options("*", cors());

app.use(express.json());

app.use("/api/gigs", gigRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Gig Service is running on port ${PORT}`);
});
