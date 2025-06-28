require("dotenv").config();
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const User = require("./models/User");
const Post = require("./models/Post");
const jwt = require("jsonwebtoken");
app.use(cookieParser());
app.use(csurf({ cookie: true }));
const verifyToken = require("./middleware/auth");
const isAdmin = require("./middleware/isAdmin");
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

connectDB();
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about-us", (req, res) => {
  res.render("about");
});

app.get("/blog", async (req, res) => {
  try {
    const posts = await Post.find().populate("user"); // populate to show user info
    res.render("blog", { posts }); // 👈 pass posts to your EJS
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load blog posts");
  }
});

app.get("/contact-us", (req, res) => {
  res.render("contact");
});

app.get("/login", (req, res) => {
  if (res.locals.user) {
    return res.redirect("/profile");
  }
  res.render("login", { csrfToken: req.csrfToken() });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Basic validation
    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    // ✅ 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // ✅ 3. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    // ✅ 4. Generate JWT with userId & role
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role, // 👈 include user role!
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ 5. Set JWT as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "lax", // optional: helps prevent CSRF
    });

    // ✅ 6. Redirect to profile
    return res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong during login");
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    const posts = await Post.find({ user: user._id });

    res.render("profile", {
      user,
      postCount: posts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load profile");
  }
});

app.get("/admin", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  const posts = await Post.find().populate("user");
  res.render("admin-dashboard", { users, posts });
});

app.get("/sign", (req, res) => {
  if (res.locals.user) {
    return res.redirect("/profile");
  }
  res.render("sign", { csrfToken: req.csrfToken() });
});
app.post("/sign", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Please provide all information");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ Redirect to login page after signup
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong during sign up");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token"); // remove the JWT cookie
  res.redirect("/login"); // redirect to login page (or home)
});

// ✅ Show create post form (protected)
app.get("/posts/new", verifyToken, (req, res) => {
  res.render("new-post");
});

// ✅ Handle post creation (protected)
app.post("/posts", verifyToken, async (req, res) => {
  const { title, content, image } = req.body; // ✅ include image

  try {
    const newPost = new Post({
      title,
      content,
      image, // ✅ save image URL
      user: req.user.userId,
    });

    await newPost.save();
    res.redirect("/my-posts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating post");
  }
});

// ✅ Show all posts for logged-in user
app.get("/my-posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.render("my-posts", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

app.listen(port, () => {
  console.log(`Server Running Of Port ${port}`);
});
