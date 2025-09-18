const db = require("../../../db/connect");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");

describe("User", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe('getAllnames', () => {
    it('returns the names and usernames of all people', async () => {
        const testResult = [
            {firstname: 'Alice', username: 'alice'},
            {firstname: 'Bob', username: 'bob'}
        ]

        jest.spyOn(db, 'query').mockResolvedValueOnce({rows: testResult.map(u => new User(u))})

        const result = await User.getAllNames()

        expect(result[0].firstname).toBe('Alice')
        expect(result[1].username).toBe('bob')
        expect(db.query).toHaveBeenCalledWith(
            "select firstname, username from users;"
        )
    })

    it('should throw an error if it is unsuccessful', async () => {
        jest.spyOn(db, 'query').mockRejectedValue(new Error('oh no'))

        await expect(User.getAllNames()).rejects.toThrow("Could not get all.");
    })
  })

  describe('getOneById', () => {
    it('resolves with a user on successful db query', async () => {
        const testUser = {
        userid: 1,
        firstname: "u1",
        email: "u1@test.com",
        userpassword: "pw",
        username: "un1",
        isadmin: false
      }

      jest.spyOn(db, 'query').mockResolvedValueOnce({rows: [testUser]})

      const result = await User.getOneById(1)

      expect(result).toBeInstanceOf(User)
      expect(result.userid).toBe(1)
      expect(result).toEqual(new User(testUser))
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE userid = $1;",
        [1]
      )
    })

    it("should throw an Error if user not found", async () => {
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });
      await expect(User.getOneById(999)).rejects.toThrow("User not found");
    });
  })

  describe("getOneByUsername", () => {
    it("resolves with user on successful db query", async () => {
      const testUser = {
        userid: 1,
        firstname: "u1",
        email: "u1@test.com",
        userpassword: "pw",
        username: "un1",
        isadmin: true
      };

      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [testUser] });

      const result = await User.getOneByUsername("un1");

      expect(result).toBeInstanceOf(User);
      expect(result.username).toBe("un1");
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = $1;",
        ["un1"]
      );
    })
    })

    describe("createUser", () => {
    it("resolves with user on successful creation", async () => {
      const mockUserData = {
        firstname: "u10",
        email: "u10@test.com",
        userpassword: "pw",
        username: "un10",
        isadmin: true
      };

      // Mock INSERT query
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{ userid: 1 }] });

      // Mock getOneById called inside createUser
      jest.spyOn(User, "getOneById").mockResolvedValueOnce(
        new User({ userid: 1, ...mockUserData })
      );

      const result = await User.createUser(mockUserData);

      expect(result).toBeInstanceOf(User);
      expect(result.userid).toBe(1);
      expect(result.firstname).toBe("u10");
      expect(result.username).toBe("un10");
      expect(result.email).toBe("u10@test.com");
    });

    it("should throw an Error when there are missing field(s)", async () => {
      const invalidData = { email: "u10@test.com" };
      await expect(User.createUser(invalidData)).rejects.toThrow(
        "Please fill in all fields"
      );
    });

    it("should throw an error if user already exists", async () => {
      const existingUser = {
        firstname: "avkaran",
        email: "avi@gmail.com",
        userpassword: "lafosse",
        username: "avi17ak",
        isadmin: true

      };

      jest.spyOn(db, "query").mockRejectedValueOnce({ code: "23505" });

      await expect(User.createUser(existingUser)).rejects.toThrow(
        "Email or username already exists"
      );
    });
    });

    describe("updateUser", () => {
    it("should return the updated user on successful update", async () => {
      const testUser = new User({
        userid: 1,
        firstname: "u1",
        email: "u1@test.com",
        userpassword: "pw",
        username: "un1",
        isadmin: true
      });

      const updatedUserData = {
        firstname: "u1",
        email: "u1@test.com",
        userpassword: "pw_new",
        username: "un1_new",
        isadmin: true
      };

      // Mock bcrypt
      jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed_pw");

      // Mock DB query
      jest.spyOn(db, "query").mockResolvedValueOnce({
        rows: [{ userid: 1, ...updatedUserData }],
      });

      const result = await testUser.updateUser(updatedUserData);

      expect(result).toBeInstanceOf(User);
      expect(result.userid).toBe(1);
      expect(result.username).toBe("un1_new");
      expect(result.userpassword).toBe("pw_new"); // Your constructor sets password directly

      expect(db.query).toHaveBeenCalledWith(
        `UPDATE users SET
        firstname = COALESCE($1, firstname),
        email = COALESCE($2, email),
        userpassword = COALESCE($3, userpassword),
        username = COALESCE($4, username)
        isadmin = COALESCE($5, isadmin)
        WHERE userid = $6
        RETURNING *;`,
        [
          updatedUserData.firstname,
          updatedUserData.email,
          "hashed_pw",
          updatedUserData.username,
          updatedUserData.isadmin,
          testUser.userid,
        ]
      );
    });

    it("should throw an Error when no rows are returned", async () => {
      const testUser = new User({
        userid: 2,
        firstname: "u2",
        email: "u2@test.com",
        userrpassword: "pw",
        username: "un2",
        isadmin: true
      });

      jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed_pw");
      jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [] });

      await expect(
        testUser.updateUser({
          firstname: "u2_new",
          email: "u2_new@test.com",
          userpassword: "pw_new",
          username: "un2_new",
          isadmin: true
        })
      ).rejects.toThrow("Unable to update the user details");
    });

    it("should throw an Error if email or username already exists", async () => {
      const testUser = new User({
        userid: 3,
        firstname: "u3",
        email: "u3@test.com",
        userpassword: "pw",
        username: "un3",
        isadmin: true
      });

      jest.spyOn(bcrypt, "genSalt").mockResolvedValue("salt");
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed_pw");
      jest.spyOn(db, "query").mockRejectedValueOnce({ code: "23505" });

      await expect(
        testUser.updateUser({
          firstname: "u3_new",
          email: "conflict@test.com",
          userpassword: "pw_new",
          username: "un3_new",
          isadmin: true
        })
      ).rejects.toThrow("Email or username already exists");
    });
  });
    
})