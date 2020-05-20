require('../src/db/mongoose')
const Task = require('../src/models/task')


// 5eb41f7a772f827b190babe4

/*Task.findByIdAndDelete('5eb30a6c1620ad665a51484b').then((task) => {
	console.log(task)
	return Task.countDocuments({completed:false})
}).then((result) => {
	console.log(result)
}).catch((e) => {
	console.log(e)
}) */

const deleteTaskAndCount = async (id) => {
	const task = await Task.findByIdAndDelete(id)
	const count = await Task.countDocuments({completed:false})
	return count
}


deleteTaskAndCount('5eb4ad8a0528ddaaa5dbf9ec').then((count) => {
	console.log(count)
}).catch((e) => {
	console.log(e)
})
