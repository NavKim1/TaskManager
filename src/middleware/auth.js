const jwt = require('jsonwebtoken')
const User = require('../models/user') 
const cookieParser = require('cookie-parser')


const auth = async(req,res,next) => {
	let token = ''	
	
	try{
		if(req.cookies){			
			token = req.cookies.tokenKey				
		}
		else{
			token = req.header('Authorization').replace('Bearer ','')
		}
		console.log('COOKIES at auTH: ', token)
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})
		
	if(!user){
		console.log("!USER")
		throw new Error()
	}	
	req.token = token
	req.user = user	
	next()
	}catch(e){
		console.log("ERROR FOUND AUTH "+e)
		res.status(401).send({ error:'Please send authentication'})
	}
}

module.exports = auth
