const reviewController = require('../../../controllers/reviews')
const Review = require('../../../models/Reviews')

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

        it('should return a list of reviews with a 200 status code', async () => {
            const expectedResult = [
                {
                    reviewid: 1,
                    reviewtitle: "Good job",
                    reviewcontents: "Good job",
                    reviewtype: "Sprint",
                    reviewdata: "Tuesday",
                    skills: {Python: 5}
                }
            ]
            
            jest.spyOn(Review, 'getAll').mockResolvedValue(expectedResult.map(r => new Review(r)))

            await reviewController.index(mockReq, mockRes)

            expect(Review.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(expectedResult.map(r => new Review(r)))
        })

        it('should return an error upon failure', async () => {
            jest.spyOn(Review, 'getAll').mockRejectedValue(new Error('There was an issue'))

            await reviewController.index(mockReq, mockRes)
            
            expect(Review.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: 'There was an issue' })
        })
    })

    describe('show', () => {
        const mockReq = { params: { id: 1 } }

        it('should return the reviews for a specific user', async () => {
            const expectedResult = [
                {
                    reviewid: 1,
                    reviewtitle: "Good job",
                    reviewcontents: "Good job",
                    reviewtype: "Sprint",
                    reviewdata: "Tuesday",
                    skills: {Python: 5}
                }
            ]
            
            jest.spyOn(Review, 'getOneByUserId').mockResolvedValue(expectedResult.map(r => new Review(r)))

            await reviewController.show(mockReq, mockRes)

            expect(Review.getOneByUserId).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(expectedResult.map(r => new Review(r)))
        })

        it('should return an error upon failure', async () => {
            jest.spyOn(Review, 'getOneByUserId').mockRejectedValue(new Error('There was an issue'))

            await reviewController.show(mockReq, mockRes)
            
            expect(Review.getOneByUserId).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: 'There was an issue' })
        })
    })

    describe('create', () => {
        mockReq = {
            body: {
                employee: false,
                category: 'Sprint',
                recog_title: 'Good job',
                recog_review: 'Good job',
                skills: [{skillname: 'Python', score: 5}]
            }
        }
        it('should return a success message on successful updating', async () => {
            data = mockReq.body

            jest.spyOn(Review, 'createReview').mockResolvedValue({'Did it work': 'Success' })

            await reviewController.create(mockReq, mockRes)

            expect(Review.createReview).toHaveBeenCalledTimes(1)
            expect(mockJson).toHaveBeenCalledWith({'Did it work': 'Success' })
            expect(mockStatus).toHaveBeenCalledWith(201)
        })

        it('should return an error message on failure', async () => {
            jest.spyOn(Review, 'createReview').mockRejectedValue(new Error('No'))

            await reviewController.create(mockReq, mockRes)
            
            expect(Review.createReview).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockJson).toHaveBeenCalledWith({error: 'No'})
        })
    })
})