const db = require('../db/connect')

class Reviews {
    constructor({ userid, reviewid, reviewtitle, reviewcontents, reviewtype, reviewdate, skills}) {
        this.userid = userid;
        this.reviewid = reviewid
        this.userid = userid
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

            const skills = await db.query(
                `select reviewid, skills.skillname, review_skills.score 
                from review_skills 
                LEFT JOIN skills on skills.skillid = review_skills.skillid;`)
            
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
            throw new Error(err.message)
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
        catch(err){throw new Error(err.message)
        }
    }

    static async createReview(data){
        const { employee, category, recog_title, recog_review, skills } = data;
       
        try{
            const response = await db.query(`SELECT userid FROM users WHERE username = $1;`,[employee])
            
            if (response.rows.length === 0) {
                throw new Error ('No response')
            }
            
            const userid = response.rows[0].userid

            const reviewResult = await db.query(`INSERT INTO reviews (userid, reviewtitle, reviewcontents, reviewtype)
                                                 VALUES ($1, $2, $3, $4)
                                                 RETURNING reviewid;`,[userid,recog_title,recog_review,category]
                                                )

            if (reviewResult.rows.length === 0) {
                throw new Error ('No response')
            }
            
            const reviewid = reviewResult.rows[0].reviewid
            
            for (let i = 0; i < skills.length; i++) {
                const review_skills_result = await db.query('SELECT skillid FROM skills where skillname = $1;', [skills[i].skill])
                
                const skillid = review_skills_result.rows[0].skillid
                const score = parseInt(skills[i].rating)

                const finalResult = await db.query(`INSERT INTO review_skills (reviewid, skillid, score)
                                                    VALUES ($1, $2, $3)
                                                    RETURNING *;`,[reviewid, skillid, score])
            }
            
            return true
        } catch (err) {
            throw new Error(err.message)
        }

    }
}

module.exports = Reviews;