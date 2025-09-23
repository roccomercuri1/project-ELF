const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

async function index(req, res) {
  try {
    const userData = await User.getAllNames();
    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function show(req, res) {
  try {
    const id = req.params.id;
    const userData = await User.getOneById(id);
    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function register(req, res) {
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(parseInt("10"))
    data.userpassword = await bcrypt.hash(data.userpassword, salt);
    const result = await User.createUser(data);
    return res.status(201).json(result);
  } catch (err) {
    const msg = (err.message || "").toLowerCase();
    if (err.code === "23505" || msg.includes("already exists")) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }
    console.log("Registration error");
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  const data = req.body;
  try {
    const user = await User.getOneByUsername(data.username);
    if (!user) {
      throw new Error("No user with this username");
    }
    const match = await bcrypt.compare(data.userpassword, user.userpassword);

    if (match) {
      const payload = { userid: user.userid };
      const sendToken = (err, token) => {
        if (err) {
          throw new Error(err.message);
        }
        res.status(200).json({
          success: true,
          token: token,
          userid: user.userid,
          isadmin: user.isadmin,
          firstname: user.firstname
        });
      };

      jwt.sign(
        payload,
       "ELF2025",
        { expiresIn: 3600 },
        sendToken
      );
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function checkPassword(req, res) {
  try {
    const data = req.body
    const user = await User.getOneByUsername(data.username)

    const match = await bcrypt.compare(data.userpassword, user.userpassword);

    res.status(200).json(match)
  } catch(err) {
    res.status(400).json({ error: err.message})
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await User.getOneById(id);
    const result = await user.updateUser(data);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function forgotPassword(req, res) { // ADD
  try {
    const { username, email, newPassword } = req.body;

    if (!username || !email || !newPassword) {
      console.log('[forgot-password] missing fields');
      return res.status(400).json({ error: "All fields are required" });
    }
    // if (String(newPassword).length < 6) {
    //   return res.status(400).json({ error: "Password must be at least 6 characters" });
    // }

    // find user by username (re-uses your existing method)
    let user;
    try {
      user = await User.getOneByUsername(username);
      console.log('[forgot-password] found user id=', user.userid);
    } catch {
      // generic response to avoid revealing whether the account exists
      console.log('[forgot-password] user not found');
      return res.status(200).json({ ok: true });
    }

    // compare emails case-insensitively
    const emailsMatch =
      String(user.email || "").trim().toLowerCase() === String(email).trim().toLowerCase();
      console.log('[forgot-password] email match?', emailsMatch, 'db=', user.email, 'got=', email);
    if (!emailsMatch) {
      return res.status(200).json({ ok: true });
    }

    // hash + update
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const hashed = await bcrypt.hash(newPassword, salt);
    await User.updatePasswordById(user.userid, hashed);
    console.log('[forgot-password] updated password');

    // (optional) send a notification email here

    return res.status(200).json({ success: true });
  } catch (err){
    console.log('[forgot-password] error:', err.message);
    return res.status(200).json({ ok: true }); // stay generic
  }
}

module.exports = { 
  index, 
  register, 
  login, 
  update, 
  show,
  checkPassword,
  forgotPassword
};
