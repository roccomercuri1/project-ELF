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
})