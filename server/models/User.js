const bcrypt = require("bcrypt")
const db= require('../db/connect')

class User {
  constructor({ userid, firstname, email, userpassword, username, isadmin }) {
    this.userid = userid
    this.firstname = firstname
    this.email = email
    this.userpassword = userpassword
    this.username = username
    this.isadmin = isadmin // ADDED: isadmin property
  }

  static async getOneById(id) {
    const response = await db.query("SELECT * FROM users WHERE userid = $1;", [
      id,
    ]);
    if (response.rows.length != 1) {
      throw new Error("User not found")
    }
    return new User(response.rows[0])
  }

  static async getOneByUsername(username) {
    const response = await db.query(
      "SELECT * FROM users WHERE username = $1;",
      [username]
    );

    if (response.rows.length != 1) {
      throw new Error("Username not found")
    }
    return new User(response.rows[0])
  }

  static async createUser(data) {
    // UPDATED: INCLUDES isadmin FIELD
    const { firstname, email, password, username, isadmin } = data

    // Validate
    if (!firstname || !email || !password || !username) {
      throw new Error("Please fill in all fields")
    }

    try {
      // UPDATED QUERY: Added isadmin field
      const response = await db.query(
        `INSERT INTO users (firstname, email, password, username, isadmin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING userid;`,
        [firstname, email, password, username, isadmin] // ADDED: isadmin value
      );

      if (response.rows.length === 0) {
        throw new Error("Failed to create user")
      }

      const newId = response.rows[0].userid
      return await User.getOneById(newId)
    } catch (err) {
      // Handle if user already exists
      if (err.code === "23505") {
        // PostgreSQL unique_violation
        throw new Error("Email or username already exists")
      }
      throw err
    }
  }
}

module.exports = User