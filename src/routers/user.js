const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')
const multer = require('multer')



// user creation
router.post('/users', async (req, res) => {
	
	const user = new User(req.body)
	
	try{
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({user, token})
	}catch(e){
		res.status(400).send(e)
	}

})

// user login
router.post('/users/login', async(req,res) => {
	console.log('cred: '+req.body.email, req.body.password)	
		
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()		
		res.send({user,token})	
	}catch(e){
		res.status(400).send('Your username and password did not match')
	}
})

// getting user profile
router.get('/users/me', auth , async (req,res) => {
	res.send(req.user)
	
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
		res.send(req.user)

	}catch(e){
		res.status(500).send()
	}

})

// logout user
router.post('/users/logout', auth, async (req,res) => {
	try{
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
		fileSize:1000000
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
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
	req.user.avatar = req.file.buffer
	await req.user.save()	
	res.send()
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
		console.log('user.avatar')
	}
	catch(e){
		res.status(400).send()
	}	

})




module.exports = router
