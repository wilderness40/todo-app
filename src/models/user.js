const mongoose = require('mongoose')

const { Schema } = mongoose // 몽구스 패키지에서 스키마를 뽑아낸다

const userSchema = new Schema({ // 스키마 정의
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // unique : 색인(primary key) email은 중복이 불가하기 때문에 id값으로 사용가능해서 primary key라 함
    },
    userId: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    }    
})

// 메모리에만 있던 위의 객체를 몽구스롤 통하여 구현
const User = mongoose.model('User', userSchema) // User => users 컬렉션 생성
module.exports = User

// User 데이터 생성 테스트

const user = new User({
    name: '승현',
    email: 'midbar@gmail.com',
    userId: 'midbar',
    password: '12345678',
    isAdmin: true,
})

user.save() // 메모리에 저장
.then(() => console.log('user created!'))
