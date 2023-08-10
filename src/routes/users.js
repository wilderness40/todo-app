const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router() // 하위 url 로직을 처리하는 라우터 모듈

router.post('/register', expressAsyncHandler(async(req, res, next) => {
    console.log(req.body)
    const user = new User({  // 메모리에 데이터스키마 생성
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: req.body.password,
    })
    const newUser = await user.save()  // DB에 User 생성
    if(!newUser){
        res.status(401).json({ code:401, message: 'Invalid User Data'}) // 사용자 정보를 빠뜨린 경우 ( required 값 미입력)
    }else{
        const { name, email, userId, isAdmin, createdAt } = newUser // password는 브라우저에게 전송하면 안되서 제외
        res.json({
            code: 200,
            token: generateToken(newUser),  // 인증을 위한 값
            name, email, userId, isAdmin, createdAt, // 사용자 정보 표출을 위한 값
        })
    }
})) 

router.post('/login', expressAsyncHandler(async(req, res, next) => {
    console.log(req.body)
    const loginUser = await User.findOne({  // findOne은 자체 메소드
        email: req.body.email,
        password: req.body.password,
    })
    if(!loginUser){
        res.status(401).json({ code: 401, message: 'Invaild Email or Password'})
    }else{
        const { name, email, userId, isAdmin, createdAt } = loginUser
        res.json({
            code: 200,
            token: generateToken(loginUser),
            name, email, userId, isAdmin, createdAt,
        })
    }
}))

router.post('/logout', (req, res, next) => { // /api/users/logout
    res.json('로그아웃')
})

// isAuth : 사용자를 수정할 권한이 있는지 검사하는 미들웨어
router.put('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id) // 사용자의 id값 찾기
    if(!user){
        res.status(404).json({code: 404, message: 'User Not Found'})
    }else{
        user.name = req.body.name || user.name  // req.body에서 name을 보냈으면 req.body.name을 사용하고 없으면 원래 값을 사용한다
        user.email = req.body.email || user.email
        user.password = req.body.password || user.password
        user.isAdmin = req.body.isAdmin || user.isAdmin
        user.lastModifiedAt = new Date()  // 수정시각 업데이트
        const updateUser = await user.save() // DB에 사용자 정보 업데이트
        const { name, email, userId, isAdmin, createdAt } = updateUser
        res.json({
            code: 200,
            token: generateToken(updateUser),
            name, email, userId, isAdmin, createdAt,
        })
    }
}))

router.delete('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id) 
    if(!user){
        res.status(404).json({ code: 404, message: 'User Not Found'})
    }else{
        res.status(204).json({ code:204, message: 'User deleted succestfully !'})
    }
}))


module.exports = router