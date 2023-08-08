const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
// const todo = require('./src/models/todo')
const user = require('./src/models/user')

let corsOptions = { // CORS 옵션
    origin: 'http://127.0.0.1:5000', //해당 URL 주소만 요청을 허락함
    credentials: true // 사용자 인증이 필요한 리소스를 요창할 수 있도록 허용함
}
let CONNECT_URL = 'mongodb://127.0.0.1:27017/midbar'
mongoose.connect(CONNECT_URL)
.then(() => console.log('mongodb connected...'))
.catch(e => console.log(`failed to connect mongodb: ${e}`))

/* 공통 미들웨어 - 시작 */
app.use(cors(corsOptions)) // CORS 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny')) // logger 설정 tiny는 꼭 써야 하는건가?
/* 공통 미들웨어 - 끝 */


app.get('/hello', (req, res) => { // URL 응답 테스트
    res.json('hello world!')
})
app.post('/hello', (req, res) => {
    console.log(req.body)
    res.json({ userId: req.body.userId, email: req.body.email})
})

/* 에러 테스트 - 에러테스트 실행시 오류처리쪽 함수가 바로 실행된다 */
app.get('/error', (req, res) => {
    throw new Error('서버에 치명적인 에러가 발생했습니다!')
}) 

app.get('/fetch', async(req, res) => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    res.send(response.data)
})

// 폴백 핸들러 (fallback handler)
app.use((req, res, next) => { // 사용자가 요청한 페이지가 없는 경우
    res.status(404).send('Page Not Found')
})

/* 오류처리 */
app.use((err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send('Internal Sever Error') // HTTP 코드 (200, 401, 404, 500)
}) 


app.listen(5000, () => {
    console.log('sever is running on port 5000...')
})

