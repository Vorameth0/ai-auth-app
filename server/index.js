const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ public route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ test route
app.get("/test", (req, res) => {
  res.json({ message: "TEST OK" });
});

// 🔒 protected route (ยังไม่ใช้ auth)
app.get("/protected", (req, res) => {
  res.json({
    message: "Protected API works 🔥",
  });
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});