DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS review_skills CASCADE;



CREATE TABLE users (
    userid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    isadmin BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE skills (
    skillid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    skillname VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE reviews (
    reviewid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userid INT NOT NULL,
    reviewtitle VARCHAR(255) NOT NULL,
    reviewcontents TEXT NOT NULL,
    reviewtype VARCHAR(255) NOT NULL,
    reviewdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

CREATE TABLE review_skills (
    reviewid INT NOT NULL,
    skillid INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    PRIMARY KEY (reviewid, skillid),
    FOREIGN KEY (reviewid) REFERENCES reviews(reviewid) ON DELETE CASCADE,
    FOREIGN KEY (skillid) REFERENCES skills(skillid) ON DELETE CASCADE
);

-- Insert Users
INSERT INTO users (isadmin, username, userpassword, firstname, email) VALUES
(FALSE, 'alice', 'hash_pw1', 'Alice', 'alice@example.com'),
(FALSE, 'bob',   'hash_pw2', 'Bob',   'bob@example.com');

-- Insert Skills
INSERT INTO skills (skillname) VALUES
('Python'),
('Java'),
('JavaScript'),
('Teamwork'),
('Communication'),
('HTML/CSS'),
('Terraform'),
('Ansible'),
('AWS'),
('Leadership');

-- Insert Reviews
INSERT INTO reviews (userid, reviewtitle, reviewcontents, reviewtype) VALUES
(1, 'Python project review', 'Alice did a great job using Python for data analysis.', 'Sprint'),
(1, 'Teamwork feedback',     'Alice collaborated very effectively in the project team.', 'Sprint'),
(1, 'Communication review',  'Alice presented results clearly to stakeholders.', 'Sprint'),
(2, 'Java backend project',  'Bob implemented the backend in Java successfully.', 'Sprint'),
(2, 'Frontend in JS',        'Bob used JavaScript well for the frontend.', 'Sprint'),
(2, 'Teamwork evaluation',   'Bob contributed effectively in a group setting.', 'Sprint'),
(1, 'Full stack review',     'Alice handled both backend and frontend.', 'Sprint'),
(2, 'Presentation feedback', 'Bob delivered a strong project presentation.', 'Sprint'),
(1, 'Leadership potential',  'Alice showed initiative in leading the group.', 'Sprint'),
(2, 'Mixed skills review',   'Bob demonstrated diverse skill usage.', 'Sprint');

-- Insert Review Skills (reviewid, skillid, score)
-- Review 1: Alice Python project
INSERT INTO review_skills VALUES (1, 1, 5); -- Python

-- Review 2: Alice Teamwork
INSERT INTO review_skills VALUES (2, 4, 4);

-- Review 3: Alice Communication
INSERT INTO review_skills VALUES (3, 5, 5);

-- Review 4: Bob Java backend
INSERT INTO review_skills VALUES (4, 2, 4);

-- Review 5: Bob Frontend JS
INSERT INTO review_skills VALUES (5, 3, 3);

-- Review 6: Bob Teamwork
INSERT INTO review_skills VALUES (6, 4, 5);

-- Review 7: Alice Full stack (Python + JS)
INSERT INTO review_skills VALUES (7, 1, 4), (7, 3, 4);

-- Review 8: Bob Presentation (Communication)
INSERT INTO review_skills VALUES (8, 5, 4);

-- Review 9: Alice Leadership (Teamwork + Communication)
INSERT INTO review_skills VALUES (9, 4, 5), (9, 5, 5);

-- Review 10: Bob Mixed skills (Java + Python + Teamwork)
INSERT INTO review_skills VALUES (10, 2, 3), (10, 1, 4), (10, 4, 3);