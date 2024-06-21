var express = require("express");
var router = express.Router();
var app = express();
var expresshbs = require("express-handlebars");
const bcrypt = require("bcryptjs");
const User = require("../model/User/User");

app.engine(".hbs", expresshbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

router.post("/register", async (res, req) => {
  try {
    const { useremail, password } = req.body;

    const existingUser = User.findOne({ useremail });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_email: useremail,
      password: hashedPassword,
      role: "User",
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
