const mongoose = require('mongoose')


const { Schema } = mongoose // 구조분해 사용 mongoose.Schema로 써도 되지만 구조분해 사용
const { Types: { ObjectId } } = Schema // mongoose.Schema.Types.ObjectId 와 동일함

const todoSchema = new Schema({ // 스키마 정의
    author: {
        type: ObjectId, // 사용자의 ID
        required: true, // 필수작성 필드,데이터 저장시 빠져있으면 mongodb에서 오류나므로 반드시 기재해야함
        ref: 'User' // 사용자 모델을 참조, 어떤 사용자의 todo 인지 알 수있음, 사용자의 id값
    },
    title: {
        type: String,
        required: true,
        trim: true, // 데이터베이스 저장전 공백없애주기
    },
    description: {
        type: String,
        trim: true
    },
    isDone: {
        type: Boolean,
        default :false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date,
        default: Date.now
    }
})

const Todo = mongoose.model('Todo', todoSchema) // Todo => todos 몽고db에서 컬렉션이름 todos로 자동저장됨
module.exports = Todo // 외부에서 해당 파일을 사용할 수 있도록 허용

// todo 데이터 생성 테스트
// const todo = new Todo({
//     author: '111111111111111111111111', // 24자리 Mongodb 고유 ID값
//     title: '주말에 공원 산책가기',
//     description: '주말에 집 주변에 있는 공원 가서 1시간 산책하기'
// })

// // 데이터베이스 접속 => 비동기 이기때문에 .then()으로 접근해야함
// todo.save() // insert, insertMany와 동일하게 동작함
// .then(() => console.log('todo created!'))
// .catch(e => console.log(`Failed to create todo: ${e}`)) // 오류날 경우