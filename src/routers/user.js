const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')
const multer = require('multer')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account')

const cookieParser = require('cookie-parser')

router.use(cookieParser())


router.use(morgan('dev'))

router.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
router.use(bodyParser.json())

morgan(':method :url :status :res[content-length] - :response-time ms')

// homepage
router.get('/', (req, res) => {

    res.render('home', {
        title: 'Homepage',
        name: 'Andrew Mead'
	
    })
    
})



// get login 
router.get('/users/login', (req, res) => {

    res.render('login', {
        title: 'Edit Profile',
        name: 'Andrew Mead'
	
    })
    
})

// User login endPoint
router.post('/users/login', async (req,res) => {
	//res.setHeader('Content-Type', 'text/plain')

	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.cookie('tokenKey',token)
		
		if(user){
			res.redirect('/users/me')		
		}		
			
	}catch(e){
		res.status(400).send('Your username and password did not match')
	}
	
})

// Create an Account
router.get('/users', (req, res) => {
	
	res.render('createAccount', {
        	title: 'Create an account',
		newAccount: true,
		loggedIn: false
	
    	})
})



// User creation endpoint
router.post('/users', async (req, res) => {
	
	const user = new User(req.body)
	
	try{
		await user.save()
		sendWelcomeEmail(user.email, user.name)
		const token = await user.generateAuthToken()
		// res.status(201).send({user, token})
		res.redirect('/users/me')
	}catch(e){
		console.log('error ',e)
		
		//let errorObj = JSON.parse(e.errors) // already an object
		//let errorObj = JSON.stringify(e.errors) // creates as string
		
		let errorObj = e.errors // already an object [object Object]
		let msg = ''
		
		for( let prop in errorObj ){
    			msg += errorObj[prop].message 
		}
		
		let displayMsg = msg.replace(/Path/g, "").replace(/`/g, "")
		
		res.render('createAccount', {
        	title: 'Create an account - need to correct ',
		newAccount: true,
		loggedIn: false,
		errors: displayMsg
		})	


	}

})


// Get user player profile
router.get('/users/me', auth, async (req,res) => {
	
	await res.render('profile', {
        	title: 'My Profile',
        	loggedIn: true
	
    	})
	
	
})


// updating based on URL parameter
router.patch('/users/me', auth, async (req,res) => {
	const updates = Object.keys(req.body)	
	const allowedUpdates = ['name', 'email', 'password', 'age']	
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update)
	})

	if(!isValidOperation){
		return res.status(400).send({error:'Invalid updates'})
	}

	try{
		
		updates.forEach((update) => {
			req.user[update] = req.body[update]
		})	
				
		await req.user.save()	
		res.send(req.user)
	}catch(e){
		res.status(400).send(e.Error)
	}
})

// delete user
router.delete('/users/me', auth, async (req,res) => {
	try{
		//const user = await User.findByIdAndDelete(req.user._id)
		//if(!user){
			//return res.status(404).send()
		//}
		
		await req.user.remove()
		sendCancelEmail(req.user.email, req.user.name)
		res.send(req.user)

	}catch(e){
		res.status(500).send()
	}

})

// get logout user
router.get('/users/logoutAll', (req, res) => {
  	res.clearCookie("tokenKey");	 	
    	res.render('login', {
        	title: 'Logged Out',
        	name: 'Andrew Mead'
	
    	})
    
})




// logout user
router.post('/users/logout', auth, async (req,res) => {
	try{
		res.clearCookie("tokenKey");		
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token //looking for tokens not used, filters out token used
		})
		await req.user.save()
		res.send()
	}
	catch(e){	
		res.status(500).send()
	}	
}) 

// logout all users
router.post('/users/logoutAll', auth, async (req,res) => {
	try{
		res.clearCookie("tokenKey");		
		req.user.tokens = []
		await req.user.save()
		res.send()
	}
	catch(e){	
		res.status(500).send()
	}	
}) 

// upload image

const upload = multer({
	// dest:'avatars',
	limits: {
		fileSize:9000000
	},
	fileFilter(req, file, cb) {
		if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Please upload an image'))
		}		
					
		cb(undefined, true)
		
		/* cb(new Error('File must be a PDF'))	
		cb(undefined, true)
		cb(undefined, false)
		*/	
	}

})

// creating and updating the avatar
router.post('/users/me/avatar/', auth, upload.single('avatar'), async (req,res) => {
	req.user.avatar = req.file.buffer
	await req.user.save()
	
	let imgPath = '/users/'+ req.user._id +'/avatar/'
	
	res.render('profile', {
		imgStr : imgPath			
	})	
	
},(error, req, res, next) => {
	res.status(400).send({error:error.message}) // for any uncaught error
})

// delete the avatar
router.delete('/users/me/avatar', auth, async (req,res) => {
	req.user.avatar = undefined
	await req.user.save()	
	res.send()
},(error, req, res, next) => {
	res.status(400).send({error:error.message}) // for any uncaught error
})

// get the avatar
router.get('/users/:id/avatar', auth, async (req,res) => {
	try{
		const user = await User.findById(req.params.id)
		if(!user || !user.avatar){
			throw new Error()
		}
		
		res.set('Content-Type','image/jpg')
		res.send(user.avatar)
		//console.log('user.avatar')
	}
	catch(e){
		res.status(400).send()
	}	

})




module.exports = router
