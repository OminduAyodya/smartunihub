const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const eventRoutes = require("./routes/eventRoutes");
const offerRoutes = require("./routes/offerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.json({ message: "SmartUniHub Canteen API is running" });
});

// Legacy routes (kept for compatibility)
app.use("/foods", foodRoutes);
app.use("/request", requestRoutes);
app.use("/users", userRoutes);
app.use("/offers", offerRoutes);

// Requested API routes
app.use("/api/foods", foodRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/offers", offerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
