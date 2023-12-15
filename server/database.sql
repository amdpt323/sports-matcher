CREATE TABLE users(
 id SERIAL PRIMARY KEY,
 username VARCHAR(28) NOT NULL UNIQUE,
 email VARCHAR NOT NULL UNIQUE,
 passhash VARCHAR NOT NULL,
 otp VARCHAR
);

INSERT INTO users(username,email,passhash) values($1,$2,$3);