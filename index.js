const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { checkWebsites } = require("./monitor");
const cron = require("node-cron");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'my-super-secret', 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 5 * 60 * 1000 } // ✅ Auto logout after 5 mins
}));

const WEBSITES_FILE = path.join(__dirname, "websites.json");

// Middleware to auto sign-out on inactivity
app.use((req, res, next) => {
  if (req.session.authenticated) {
    if (!req.session.lastActivity) req.session.lastActivity = Date.now();
    const now = Date.now();

    // If inactive for more than 5 mins, logout
    if (now - req.session.lastActivity > 5 * 60 * 1000) {
      req.session.destroy(() => res.redirect("/login"));
      return;
    }

    req.session.lastActivity = now;
  }
  next();
});

// Login page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL) {
    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (match) {
      req.session.authenticated = true;
      req.session.lastActivity = Date.now();
      return res.redirect("/admin");
    }
  }
  res.render("login", { error: "Invalid credentials" });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// Home route
app.get("/", (req, res) => {
  res.send(`working`);
});

// Admin route
app.get("/admin", (req, res) => {
  if (!req.session.authenticated) return res.redirect("/login");

  const websites = JSON.parse(fs.readFileSync(WEBSITES_FILE));
  res.render("index", { websites });
});

app.post("/add", (req, res) => {
  if (!req.session.authenticated) return res.redirect("/login");

  const websites = JSON.parse(fs.readFileSync(WEBSITES_FILE));
  if (!websites.includes(req.body.url)) {
    websites.push(req.body.url);
    fs.writeFileSync(WEBSITES_FILE, JSON.stringify(websites, null, 2));
  }
  res.redirect("/admin");
});

app.post("/remove", (req, res) => {
  if (!req.session.authenticated) return res.redirect("/login");

  let websites = JSON.parse(fs.readFileSync(WEBSITES_FILE));
  websites = websites.filter(url => url !== req.body.url);
  fs.writeFileSync(WEBSITES_FILE, JSON.stringify(websites, null, 2));
  res.redirect("/admin");
});

// Cron job every 15 mins
cron.schedule("*/15 * * * *", () => {
  console.log("Running scheduled website check...");
  checkWebsites();
});

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

