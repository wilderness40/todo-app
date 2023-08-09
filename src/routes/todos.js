const express = require('express')
const Todo = require('../models/Todo')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const router = express.Router()

router.get('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    const todos = await Todo.find({ author : req.user._id }) // 해당 사용자의 할일목록 조회
    if(todos.length === 0){
        res.status(404).json({ code: 404, message: 'Failed to find todos'})
    }else{
        res.json({code: 200, todos}) // todos : todos: todos를 기재
    }
})) 

router.get('/:id', (req, res, next) => {  // /api/todos/{id}
    res.json('특정 할일 조회')
})

router.post('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    // 중복체크 (현재 사용자가 생성하려는 TODO의 타이틀이 이미 DB에 있는지 먼저 검사해야함)
    const searchedTodo = await Todo.findOne({
        author: req.user._id,
        title: req.body.title,
    })
    if(searchedTodo){
        res.status(204).json({ code:204, message: '이미 todo 있음'})
    }else{
        const todo = new Todo({
            author: req.user._id, // 현재 사용자의 id
            title: req.body.title,
            descripttion: req.body.descripttion
        })
        const newTodo = await todo.save()
        if(!newTodo){
            res.status(401).json({ code: 401, message: 'Failed to save todo'})
        }else{
            res.status(201).json({
                code:201,
                message: 'New Todo Created',
                newTodo
            })
        }
    }
}))
router.put('/:id', (req, res, next) => { // /api/todos/{id}
    res.json('특정 할일 변경')
})

router.delete('/:id', (req, res, next) => { // /api/todos/{id}
    res.json('특정 할일 삭제')
})

module.exports = router