const userController = require('../../../controllers/user')
const User = require('../../../models/User')
const bcrypt = require("bcrypt");


// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };

describe('User controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        const mockReq = {}

        it('should return a list of users with a 200 status code', async () => {
            const expectedResult = [
                {firstname: "Alice", username: "alice"},
                {firstname: "Bob", username: "bob"}
            ]
            
            jest.spyOn(User, 'getAllNames').mockResolvedValue(expectedResult.map(u => new User(u)))

            await userController.index(mockReq, mockRes)

            expect(User.getAllNames).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(expectedResult.map(u => new User(u)))
        })

        it('should return an error upon failure', async () => {
            jest.spyOn(User, 'getAllNames').mockRejectedValue(new Error('There was an issue'))

            await userController.index(mockReq, mockRes)
            
            expect(User.getAllNames).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: 'There was an issue' })
        })
    })

    describe ('show', () => {
        let testUser, mockReq;

        beforeEach(() => {
        testUser = { userid: 1, name: 'max', email: 'max@gmail.com', username: 'max1', password: 'lafosse' }
        mockReq = { params: { id: 1 } }
        });

        it('should return a user with a 200 status code', async () => {
            jest.spyOn(User, 'getOneById').mockResolvedValue(new User(testUser))

            await userController.show(mockReq, mockRes);
            
            expect(User.getOneById).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new User(testUser))
            })

        it('should return an error if the user is not found', async () => {
            jest.spyOn(User, 'getOneById').mockRejectedValue(new Error('oh no'))

            await userController.show(mockReq, mockRes)
            
            expect(User.getOneById).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' })
        })
    })

    describe('register', () => {
        mockReq = {
            body: {
                firstname: 'max', 
                username: 'max01', 
                userpassword: 'lafosse', 
                isAdmin: true, 
                email: "max@gmail.com"
            }
        }
        
        it('should return a new user on successful completion.', async () => {
            data = mockReq.body

            jest.spyOn(bcrypt, 'hash').mockResolvedValue(data.userpassword)
            jest.spyOn(User, 'createUser').mockResolvedValue(new User(data))

            await userController.register(mockReq, mockRes)

            expect(User.createUser).toHaveBeenCalledTimes(1)
            expect(mockJson).toHaveBeenCalledWith(new User(data))
            expect(mockStatus).toHaveBeenCalledWith(201)
        }) 

        it('should return an error message on failure', async () => {
            jest.spyOn(User, 'createUser').mockRejectedValue(new Error('No'))

            await userController.register(mockReq, mockRes)
            
            expect(User.createUser).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
        })
    })

    describe('update route', () => {
        it('should update the user and return with a 200 status code', async () => {
            let testUser = {
                userid: 1, 
                username: 'max1', 
                name: 'max',
                email: 'max@gmail.com',
                password: 'lafosse'
            }

            let newTestUser = {
                userid: 1, 
                username: 'max1', 
                name: 'mehrab',
                email: 'max@gmail.com',
                password: 'lafosse'
            }

            let mockReq = {params: {id: 1}, body: {name: 'mehrab'}}

            jest.spyOn(User, 'getOneById').mockResolvedValue(new User(testUser))
            jest.spyOn(User.prototype, 'updateUser').mockResolvedValue(newTestUser)

            await userController.update(mockReq, mockRes)

            expect(User.getOneById).toHaveBeenCalledWith(1)
            expect(User.prototype.updateUser).toHaveBeenCalledWith({name: 'mehrab'})
            expect(mockStatus).toHaveBeenCalledWith(200)
        })

        it('should return an error if the userid is not found', async () => {
            const mockReq = { params: { id: 1 }, body: {} };

            jest.spyOn(User, 'getOneById').mockRejectedValue(new Error('no!'));

            await userController.update(mockReq, mockRes);

            expect(User.getOneById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({error: 'no!'});
            })
    })
})