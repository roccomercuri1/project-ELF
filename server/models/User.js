const bcrypt = require("bcrypt");

const db = require("../db/connect");

class User {
  constructor({ userid, isadmin, firstname, email, userpassword, username }) {
    this.userid = userid;
    this.isadmin = isadmin;
    this.firstname = firstname;
    this.userpassword = userpassword;
    this.email = email;
    this.username = username;
  }

    static async getAllNames() {
        try {
            const response = await db.query("SELECT userid, firstname, username, email, isadmin FROM users;");

            const result = response.rows.map(u => new User(u))

            return result
            
        } catch(err) {
            throw new Error('Could not get all.')
        }
    }

  static async getOneById(id) {
    const response = await db.query("SELECT userid, firstname, username, email, isadmin FROM users WHERE userid = $1;", [
      id,
    ]);
    if (response.rows.length != 1) {
      throw new Error("User not found");
    }
    return new User(response.rows[0]);
  }

  static async getOneByUsername(username) {
    const response = await db.query(
      "SELECT * FROM users WHERE username = $1;",
      [username]
    );

    if (response.rows.length != 1) {
      throw new Error("Username not found");
    }
    return new User(response.rows[0]);
  }

  static async createUser(data) {
    // UPDATED: INCLUDES VALIDATION
    const { firstname, email, userpassword, username,  isadmin} = data;
    // Validate
    if (!firstname || !email || !userpassword || !username || !isadmin === undefined) {
      throw new Error("Please fill in all fields");
    }

    try {
      const response = await db.query(
        `INSERT INTO users (firstname, email, userpassword, username, isadmin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING userid;`,
        [firstname, email, userpassword, username, isadmin]
      );

      if (response.rows.length === 0) {
        throw new Error("Failed to create user");
      }

      const newId = response.rows[0].userid;
      return await User.getOneById(newId);

    } catch (err) {
      // Handle if user already exists
      if (err.code === "23505") {
        // PostgreSQL unique_violation
        throw new Error("Email or username already exists");
      }
      throw err;
    }
  }

  async updateUser(data) {
    const {firstname, email, userpassword, username, isadmin} = data
    
    //salt and encrypt
    let encrypted_password = null
    if(userpassword){
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    encrypted_password = await bcrypt.hash(userpassword, salt);
    }
    try{
      const response = await db.query(`UPDATE users SET
        firstname = COALESCE($1, firstname),
        email = COALESCE($2, email),
        userpassword = COALESCE($3, userpassword),
        username = COALESCE($4, username)
        isadmin = COALESCE($5, isadmin)
        WHERE userid = $6
        RETURNING *;`, [firstname, email, encrypted_password, username, isadmin, this.userid])
        
        if (response.rows.length !== 1) {
              throw new Error('Unable to update the user details')
          } else {
              return new User(response.rows[0])
          }

    }catch(err) {
      if (err.code === "23505") {
        throw new Error("Email or username already exists");
      } else {
        throw err;
      }
    }
  }
}

module.exports = User;
