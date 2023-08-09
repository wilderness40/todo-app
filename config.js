const dotenv = require('dotenv')

// process.env 객체에 .env파일의 환경변수 삽입
dotenv.config()

// 아래 코드는 process.env.MONGODB_URL을 config.MONGODB_URL로 쓰기 위해 작성한 것
module.exports = {
    MONGODB_URL : process.env.MONGODB_URL,  // .env의 MONGODB_URL의 값을 가져옴
    JWT_SECRET: process.env.JWT_SECRET
}