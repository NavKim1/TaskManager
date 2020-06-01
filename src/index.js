const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 
const path = require('path')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')

//const bodyParser = require('body-parser')


/*app.use((req,res,next) => {
	
	
})*/


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(cookieParser())



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



