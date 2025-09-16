const db = require('../db/connect')

class Reviews {
    constructor({ reviewid, reviewtitle, reviewcontents, reviewtype, reviewdate, skills}) {
        this.reviewid = reviewid
        this.reviewtitle = reviewtitle
        this.reviewcontents = reviewcontents
        this.reviewtype = reviewtype
        this.reviewdate = reviewdate
        this.skills = skills
    }

    static async getAll() {
        try {
            const response = await db.query("select * from reviews;");

            const result = response.rows.map(review => new Reviews(review))

            const skills = await db.query("select reviewid, skills.skillname, review_skills.score from review_skills LEFT JOIN skills on skills.skillid = review_skills.skillid;")
            
            const skillMap = {}

            for (const s of skills.rows) {
                if (!skillMap[s.reviewid]) {
                    skillMap[s.reviewid] = {}
                }
                skillMap[s.reviewid][s.skillname] = s.score
            }

            for (const r of result) {
                r.skills = skillMap[r.reviewid] || {}
            }

            return result
            
        } catch(err) {
            throw new Error('Could not get all.')
        }
    }
    
    static async getOneByUserId(id) {
        try{
            const response = await db.query("select * from reviews WHERE userid = $1;", [id]);
            
            if(response.rows.length === 0){
                throw new Error ('No response')
            }

            const result = response.rows.map(review => new Reviews(review))

            const skills = await db.query(
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
                [id]
                );
            
            const skillMap = {}

            for (const s of skills.rows) {
                if (!skillMap[s.reviewid]) {
                    skillMap[s.reviewid] = {}
                }
                skillMap[s.reviewid][s.skillname] = s.score
            }

            for (const r of result) {
                r.skills = skillMap[r.reviewid] || {}
            }

            return result
            
            
        } 
        catch(err){throw new Error('unfortunate')
        }
    }
    
}

module.exports = Reviews;