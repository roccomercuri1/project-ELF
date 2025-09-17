const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../");

as

async function show(req, res) {
  try {
    const id = req.params.id
    const userData = await User.getOneById(id)
    res.status(200).json(userData)

  } catch(err) {
    res.status(404).json({ error: err.message });
  }
}

async function register(req, res) {
  const data = req.body;
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
  data.password = await bcrypt.hash(data.password, salt);
  const result = await User.createUser(data);
  res.status(201).send(result);
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
          username: user.username
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
    const id = req.params.id
    const data = req.body
    const user = await User.getOneById(id)
    const result = await user.updateUser(data)
    res.status(200).json(result)

  } catch(err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { register, login, update, show };
