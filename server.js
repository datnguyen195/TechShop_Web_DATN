const express = require("express");
const connectDB = require("./TechShop/config/db");
var expresshbs = require("express-handlebars");
require("dotenv").config();

const app = express();

connectDB();

app.engine(".hbs", expresshbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouters = require("./TechShop/routes/auth");
app.use("/users", userRouters);

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
