const config = require('./config')
const jwt = require('jsonwebtoken')  // jsonwebtoken 불러오기

const generateToken = (user) => { // 토큰 생성 : 사용자 정보
    return jwt.sign({
        _id: user._id, // 사용자정보(json 문자열)
        name: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    },
    config.JWT_SECRET, // jwt 비밀키
    {
        expiresIn: '1d',  // 만료기한 (하루)
        issuer: 'midbar',
    }
    )
} 

/* 사용자 권한 검증하기 - 시작 */
const isAuth = (req, res, next) => { // 권한을 확인하는 라우터핸들러 함수
    const bearerToken = req.headers.authorization // 요청헤더에 Authorization 속성 조회
    if(!bearerToken){
        res.status(401).json({ message: 'Token is not supplied'}) // 헤더에 토큰이 없는 경우
    } else{
        const token = bearerToken.slice(7, bearerToken.length) // Bearer 글자 제거하고 실제 jwt 토큰만 추출
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => { // verify(복호화대상, 비밀키, 에러처리) - 복호화 함수
            if(err && err.name === TokenExpiredError) { // 토큰이 만료된 경우
                res.status(419).json({ code: 419, message: 'token expired !'})
            }else if(err){  // 토큰을 복호화 하던중에 에러 발생한 경우
                res.status(401).json({ code: 401, message: 'Invaild Token'})
            }else{
            req.user = userInfo // 브라우저에서 전송한 사용자 정보(jwttoken을 복호화 한 것)를 req 객체에 저장
            next()
        }
        })
    }
}
/* 사용자 권한 검증하기 - 끝 */

/* 관리자 권한 검증하기 - 시작 */
const idAdmin = (req, res, next) => {  // 관리자 확인
    if(req.user && req.user.isAdmin){  // 로그인 유저 정보가 있고, 그 유저가 관리자 인경우
        next()  // 다음 서비스 사용할 수 있도록 허용
    }else{
        res.status(401).json({ code: 401, message: 'You are not valid admin user !'})
    }
}
/* 관리자 권한 검증하기 - 끝 */

module.exports = {  // 각각의 함수를 객체형태로 만들어서 외부로 export한다
    generateToken,
    isAuth,
    idAdmin,
}