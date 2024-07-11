const jwt = require('jsonwebtoken');
const { getuserdetails } = require('../controller/usercontrol.js');

// Custom Middleware

const isAuth = async(req, res, next) => {
    let token;
    if (req.header) {
        try {
            token = req.headers["x-auth-token"];
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decode);
            req.user = await getuserdetails(decode.id);
            next()
        } catch (error) {
            res.status(500).send({ error: "Internal Server Error in auth" })
        }   
    }
}

module.exports = isAuth;