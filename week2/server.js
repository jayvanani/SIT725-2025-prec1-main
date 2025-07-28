const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory quotes list
let quotes = [
  "The only thing we have to fear is fear itself.",
  "That which does not kill us makes us stronger.",
  "You must be the change you wish to see in the world.",
  "Life is like riding a bicycle. To keep your balance, you must keep moving.",
];

// GET all quotes
app.get("/api/quotes", (req, res) => {
  res.json({ quotes });
});

// GET a random quote
app.get("/api/quotes/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.json({ quote: quotes[randomIndex] });
});

// POST a new quote
app.post("/api/quotes", (req, res) => {
  const { quote } = req.body;

  if (!quote || typeof quote !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'quote' field." });
  }

  quotes.push(quote);

  res.status(201).json({
    message: "Quote added successfully.",
    quote: quote,
  });
});

// --- Calculator API Section ---

// GET /add?num1=3&num2=4
app.get("/add", (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }

  const result = num1 + num2;
  res.json({ result });
});

// POST /add with JSON body
app.post("/add", (req, res) => {
  const { num1, num2 } = req.body;

  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return res.status(400).json({ error: "Invalid numbers" });
  }

  const result = num1 + num2;
  res.json({ result });
});

// Calculator with operations: /calc?num1=10&num2=2&op=mul
app.get("/calc", (req, res) => {
  const { num1, num2, op } = req.query;

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }

  let result;

  switch (op) {
    case "add":
      result = n1 + n2;
      break;
    case "sub":
      result = n1 - n2;
      break;
    case "mul":
      result = n1 * n2;
      break;
    case "div":
      if (n2 === 0) return res.status(400).json({ error: "Cannot divide by zero" });
      result = n1 / n2;
      break;
    default:
      return res.status(400).json({ error: "Invalid operation" });
  }

  res.json({ result });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Start the server
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
