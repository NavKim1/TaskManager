const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000


/*app.use((req,res,next) => {
	
	
})*/

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const router = new express.Router()

app.listen(port, () => {
	console.log('Server is up on port '+port)
})




////////////////////////////////////////////////////////////////////////////////

/* const pet = {
		name: 'Hal'	
	}

pet.toJSON = function(){
	console.log(this)
	return {}
} */

//console.log(JSON.stringify(pet))

// const bcrypt = require('bcryptjs')

/*const jwt = require('jsonwebtoken')

const myFunction = async () => {
	const password = 'Red12345!'
	const hashedPassword = await bcrypt.hash(password, 8) 
	

	const token = jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'}) 
	console.log('token is' ,token)

	const data = jwt.verify(token, 'thisismynewcourse')
	console.log('data is',data)

}*/



