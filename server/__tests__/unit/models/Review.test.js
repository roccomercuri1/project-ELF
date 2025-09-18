const db = require("../../../db/connect");
const Review = require("../../../models/Reviews");

describe("User", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getAll', () => {
        it('returns a list of all the reviews', async () => {
            const testReviews = [
                {
                    reviewid: 1,
                    userid: 1,
                    reviewtitle: "Python project review",
                    reviewcontents: "Alice did a great job using Python for data analysis.",
                    reviewtype: "Sprint",
                    reviewdate: "2025-09-16 13:28:34.67154"
                },
                {
                    reviewid: 2,
                    userid: 1,
                    reviewtitle: "Teamwork feedback",
                    reviewcontents: "Alice collaborated very effectively in the project team.",
                    reviewtype: "Sprint",
                    reviewdate: "2025-09-16 13:28:34.67154"
                }
            ]

            const testSkills = [
                {
                    reviewid: 1,
                    skillname: "Python",
                    score: 5
                },
                {
                    reviewid: 2,
                    skillname: "Teamwork",
                    score: 4
                }
            ]

            const testResult = [
                {
                    reviewid: 1,
                    userid: 1,
                    reviewtitle: "Python project review",
                    reviewcontents: "Alice did a great job using Python for data analysis.",
                    reviewtype: "Sprint",
                    reviewdate: "2025-09-16 13:28:34.67154",
                    skills: { Python: 5 }
                },
                {
                    reviewid: 2,
                    userid: 1,
                    reviewtitle: "Teamwork feedback",
                    reviewcontents: "Alice collaborated very effectively in the project team.",
                    reviewtype: "Sprint",
                    reviewdate: "2025-09-16 13:28:34.67154",
                    skills: { Teamwork: 4 }
                }
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testReviews})
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testSkills})

            const result = await Review.getAll()

            expect(result).toEqual(testResult.map( r => new Review(r)))
            expect(db.query).toHaveBeenNthCalledWith(1, 
                "select * from reviews;"
            )
            expect(db.query).toHaveBeenNthCalledWith(2, 
                `select reviewid, skills.skillname, review_skills.score 
                from review_skills 
                LEFT JOIN skills on skills.skillid = review_skills.skillid;`
            )
        })

        it('should return an error if there is an error in the query', async () => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('oh no'))

            await expect(Review.getAll()).rejects.toThrow('oh no')
        })
    })

    describe('getOneByUserId', () => {
        it('returns a list of all the reviews relevant to the person', async () => {
            const testReviews = [
                {
                    reviewid: 1,
                    userid: 1,
                    reviewtitle: "Python project review",
                    reviewcontents: "Alice did a great job using Python for data analysis.",
                    reviewtype: "Sprint",
                    reviewdate: "2025-09-16 13:28:34.67154"
                }
            ]

            const testSkills = [
                {
                    reviewid: 1,
                    skillname: "Python",
                    score: 5
                },
                {
                    reviewid: 2,
                    skillname: "Teamwork",
                    score: 4
                }
            ]

            const testResult = [
                {
                    reviewid: 1,
                    userid: 1,
                    reviewtitle: "Python project review",
                    reviewcontents: "Alice did a great job using Python for data analysis.",
                    reviewtype: "Sprint",
                    reviewdate: "2025-09-16 13:28:34.67154",
                    skills: { Python: 5 }
                }
            ]

            const userid = 1

            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testReviews})
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testSkills})

            const result = await Review.getOneByUserId(userid)

            expect(result).toEqual(testResult.map( r => new Review(r)))
            expect(db.query).toHaveBeenNthCalledWith(1, 
                "select * from reviews WHERE userid = $1;", [userid]
            )
            expect(db.query).toHaveBeenNthCalledWith(2, 
                `
                SELECT 
                    review_skills.reviewid, 
                    skills.skillname, 
                    review_skills.score
                FROM review_skills
                LEFT JOIN skills 
                    ON skills.skillid = review_skills.skillid
                LEFT JOIN reviews 
                    ON reviews.reviewid = review_skills.reviewid
                WHERE userid = $1;
                `,
                [userid]
            )
        })

        it('should return an error if the rows length is 0', async () => {
            const userid = 1
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})

            await expect(Review.getOneByUserId(userid)).rejects.toThrow('No response')
        })

        it('should return an error if there is an error in the query', async () => {
            const userid = 1
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('oh no'))

            await expect(Review.getOneByUserId(userid)).rejects.toThrow('oh no')
        })
    })

    describe('createReview', () => {
        const testcase = {
            employee: false,
            category: "Sprint",
            recog_title: "Hello",
            recog_review: "Goodbye",
            skills: [
                {skill: 'AWS', rating: 3}
            ]
        }

        it('returns true if there are no errors', async () => {
            const userid = 1
            const reviewid = 1
            const skillid = 1
            
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [{userid: userid}]})
                .mockResolvedValueOnce({rows: [{reviewid: reviewid}]})
                .mockResolvedValueOnce({rows: [{skillid: skillid}]})
                .mockResolvedValueOnce({rows: [{isit: true}]})
            
            const result = await Review.createReview(testcase)
            
            expect(result).toBe(true)
        })

        it("returns an error message when there is no user", async () => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})

            await expect(Review.createReview(testcase)).rejects.toThrow('No response')
        })

        it("returns an error message when there are no reviews", async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({rows: [{userid: 1}]})
                .mockResolvedValueOnce({rows: []})
            

            await expect(Review.createReview(testcase)).rejects.toThrow('No response')
        })

        it('returns an error when there there is a db error', async () => {
            jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('oh no'))

            await expect(Review.createReview(testcase)).rejects.toThrow('oh no')
        })
    })
})