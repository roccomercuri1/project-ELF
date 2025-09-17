const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function register(req, res) {
  try {
    const raw = req.body;

    const data = {
      firstname: (raw.firstname ?? raw.name ?? "").trim(),
      email: (raw.email ?? "").trim(),
      username: (raw.username ?? "").trim(),
      password: raw.password ?? "",
      // radio inputs come as strings "true"/"false" or booleans; normalize to boolean
      isadmin: typeof raw.isadmin === "string" ? raw.isadmin === "true" : !!raw.isadmin,
    };

    // Quick validation before hashing
    if (!data.firstname || !data.email || !data.username || !data.password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Salt rounds with sane default
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    data.password = await bcrypt.hash(data.password, salt);

    const result = await User.createUser(data);
    res.status(201).send(result);
  } catch (err) {
    if (err.message.includes("already exists")) {
      return res.status(400).json({ error: "Email or username already exists" });
    }
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  const data = req.body;
  try {
    const user = await User.getOneByUsername(data.username);
    if (!user) {
      throw new Error("No user with this username");
    }
    const match = await bcrypt.compare(data.password, user.password);

    if (match) {
      const payload = { username: user.username, userid: user.userid };
      const sendToken = (err, token) => {
        if (err) {
          throw new Error("Error in token generation");
        }
        res.status(200).json({
          success: true,
          token: token,
          userid: user.userid,
          username: user.username,
        });
      };

      jwt.sign(
        payload,
        process.env.SECRET_TOKEN,
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

async function show(req, res) {
  try {
    const id = req.params.id;
    const userData = await User.getOneById(id);
    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { register, login, update, show };