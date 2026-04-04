const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const app = express();
app.use(cors());
app.use(express.json());

const expensesDB = {};

// 🔐 Auth middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: "https://dev-zhqwjjxhme75mjyx.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://my-api",
  issuer: "https://dev-zhqwjjxhme75mjyx.us.auth0.com/",
  algorithms: ["RS256"],
});

// ✅ public
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 📥 GET expenses
app.get("/expenses", checkJwt, (req, res) => {
  const userId = req.auth.sub;
  res.json(expensesDB[userId] || []);
});

// ➕ ADD expense
app.post("/expenses", checkJwt, (req, res) => {
  const userId = req.auth.sub;
  const { amount, category } = req.body;

  if (!expensesDB[userId]) {
    expensesDB[userId] = [];
  }

  const newExpense = {
    id: Date.now(),
    amount,
    category,
  };

  expensesDB[userId].push(newExpense);

  res.json(newExpense);
});

// 🗑 DELETE expense
app.delete("/expenses/:id", checkJwt, (req, res) => {
  const userId = req.auth.sub;
  const id = Number(req.params.id);

  expensesDB[userId] =
    (expensesDB[userId] || []).filter((e) => e.id !== id);

  res.json({ success: true });
});

// 🤖 AI summary (simple logic)
app.get("/ai-summary", checkJwt, (req, res) => {
  const userId = req.auth.sub;
  const expenses = expensesDB[userId] || [];

  if (expenses.length === 0) {
    return res.json({ message: "No data yet" });
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + e.amount;
  });

  let maxCategory = "";
  let maxValue = 0;

  for (let cat in categoryMap) {
    if (categoryMap[cat] > maxValue) {
      maxValue = categoryMap[cat];
      maxCategory = cat;
    }
  }

  const percent = ((maxValue / total) * 100).toFixed(0);

  res.json({
    message: `คุณใช้เงินกับ ${maxCategory} มากที่สุด (${percent}%)`,
  });
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});