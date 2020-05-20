require('../src/db/mongoose')
const User = require('../src/models/user')


// 5eb41f7a772f827b190babe4

/*User.findByIdAndUpdate('5eb4200eb6be547b5e51f226', {age:1}).then((user) => {
	console.log(user)
	return User.countDocuments({age:1})
}).then((result) => {
	console.log(result)
}).catch((e) => {
	console.log(e)
}) */

const updateAgeAndCount = async (id, age) => {
	const user = await User.findByIdAndUpdate(id, {age})
	const count = await User.countDocuments({age})
	return count
}

updateAgeAndCount('5eb4200eb6be547b5e51f226',2).then((count) => {
	console.log(count)

}).catch((e) => {
	console.log(e)
})
