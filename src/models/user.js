const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
//const cookieParser = require('cookie-parser')


const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim:true
	},
	lastName: {
		type: String,
		required: true,
		trim:true
	},	
	email:{
		type:String,
		unique:true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('email is invalid')
			}	
		}
	},
	age: {
		type:Number,
		default: 0,
		validate(value){
			if(value < 0){
				throw new Error('Age must be positive number')			
			}
		}
	},
	password:{
		type:String,
		required: true,
		trim: true,
		minlength:7,
		validate(value){
			if(value.toLowerCase().includes('password')){
				throw new Error('Password cannot be "password"')
			}
		}
		
	},
	tokens:[{
		token: {
			type:String,
			required:true
		}
	}],
	avatar:{
		type:Buffer
	}
	},{
	timestamps: true

})

// virtual attributes

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
}) 



userSchema.methods.toJSON = function(){
	const user = this
	const userObject = user.toObject()
	
	//delete userObject.password
	//delete userObject.tokens
	delete userObject.avatar	

	return userObject
}

// methods is used for instance
userSchema.methods.generateAuthToken = async function() {
	
	const user = this
	const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn:'7 days'})
	console.log("_id in token is: "+user._id.toString())
	user.tokens = user.tokens.concat({token})	
	await user.save()

	return token
	
}

// statics is used for User model
userSchema.statics.findByCredentials = async (email, password) => {
		
	const user = await User.findOne({email})
	
	if(!user){
		throw new Error('Unable to login')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if(!isMatch){
		throw new Error('Unable to login')
	}

	return user
}

// Hash the plain text password
userSchema.pre('save', async function(next){
	const user = this

	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password,8)
	}	
		
	
	next()
})

// Delete User task when user is removed

userSchema.pre('remove', async function(next){
	const user = this
	await Task.deleteMany({ owner: user._id})	
	
	next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
