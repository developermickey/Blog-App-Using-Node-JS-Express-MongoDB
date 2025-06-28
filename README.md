
# 📝 MyBlog - Node.js Blog Application

A simple blog app built with **Node.js**, **Express**, **MongoDB**, and **EJS**.  
Users can sign up, log in, create posts, and view blogs.  
Admin can view all users, all posts, and manage site content.

---

## 📌 **Features**

- 🔒 User authentication (JWT + bcrypt)
- ✅ Sign Up / Login / Logout
- 📰 Create and manage blog posts (with image URL)
- 🧑‍💻 User profile page with post count
- 🗂️ Admin dashboard to view all users and all posts
- 🔐 CSRF protection for all forms
- 🛡️ Secure cookies & basic role-based access
- ✨ Clean Tailwind CSS styling

---

## ⚙️ **Tech Stack**

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **EJS** templates
- **Tailwind CSS**
- **bcrypt** for password hashing
- **jsonwebtoken** for auth
- **cookie-parser** for JWT in cookies
- **csurf** for CSRF protection
- **express-rate-limit** for rate limiting (optional, recommended)
- **helmet** for HTTP security headers (optional, recommended)

---

## 🚀 **Getting Started**

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/myblog-app.git
cd myblog-app
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Create `.env`

```bash
cp .env.example .env
```

Fill in your `.env` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=8080
```

---

### 4️⃣ Start MongoDB

Make sure you have MongoDB running locally, or use Atlas.

---

### 5️⃣ Run the app

```bash
npm run dev
```

Visit: [http://localhost:8080](http://localhost:8080)

---

## 🗃️ **Folder Structure**

```
.
├── config/
│   └── db.js            # DB connection
├── middleware/
│   ├── auth.js          # verifyToken, isAdmin
├── models/
│   ├── User.js
│   ├── Post.js
├── views/
│   ├── partials/        # header.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── sign.ejs
│   ├── profile.ejs
│   ├── posts.ejs
│   ├── admin.ejs
├── public/              # static files (if any)
├── server.js
├── .env
└── README.md
```

---

## ✅ **Security Checklist**

✔ Passwords hashed with bcrypt  
✔ JWT tokens stored in `httpOnly` cookies  
✔ CSRF protection (`csurf`)  
✔ XSS protection (EJS auto-escapes)  
✔ Role-based access for admin routes  
✔ Secure cookies (`secure: true` in production)  
✔ Helmet for HTTP headers (recommended)  
✔ Express rate limit for auth routes (recommended)

---

## 👑 **Admin Access**

Set your admin in the database manually:  
```js
// Example: update a user to admin
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## ✨ **To Do**

- [ ] Image uploads with multer (optional)
- [ ] Better user input validation (`express-validator`)
- [ ] Add password reset flow
- [ ] Deploy with HTTPS (for `secure` cookies)

---

## 📄 **License**

MIT — use freely and customize!

---

**Happy coding!** 💚🚀
