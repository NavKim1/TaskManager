// CRUD create read update delete


const { MongoClient, ObjectID }  = require('mongodb')

const connectionURL = 'mongodb+srv://NavKim:myPassw0rd@cluster0-2gdf0.mongodb.net/test?retryWrites=true&w=majority'
const databaseName = 'task-manager'

/*const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp())
*/


MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) =>{
	if(error){
		return console.log('unable to connect')
	}
	const db = client.db(databaseName)
        // Create
	// example inserting 1
	/*db.collection('users').insertOne({
		_id: id,		
		name: 'Mike',
		age: 27
	}, (error, result) => {
		if(error){
			return console.log('Unable to insert user')
		}
		console.log(result.ops)
	}) */

	/*db.collection('tasks').insertMany([{
			description: 'Homework',
			completed: true
		},
		{
			description: 'Chores',
			completed: false
		},
		{
			description: 'Eat',
			completed: true
		}
		
	], (error, result) => {
		if(error){
			return console.log('Unable to insert user')
		}
		console.log(result.ops)
	})	*/

	// Read

	/* db.collection('users').findOne({ name:'Mike', age: 1}, (error, user) => {
		if(error){
			return console.log('unble to fetch');
		}
			console.log(user);
	
	}) */	

	/*db.collection('users').find({ age: 27}).toArray((error, users) => {	
		console.log(users)
	})*/

	// Update

	/*db.collection('users').updateOne(
	{
		_id: new ObjectID("5eb1bb0d550e333a43852137")
	},{
		$set:{
			name: 'Michelle'
		}
		$inc:{
			age: 1
		}

	}).then((result) => {
		console.log(result)
	}).catch((error) => {
		console.log(error)
	}) */


	/*db.collection('tasks').updateMany(
	{
		completed: false		
	},{		
		$set:{
			completed: true
		}
	}).then((result) => {
		console.log(result.modifiedCount)
	}).catch((error) => {
		console.log(error)
	})*/

	// Delete

	/*db.collection('users').deleteMany(
	{
		age: 27		
	}).then((result) => {
		console.log(result)
	}).catch((error) => {
		console.log(error)
	}) */

	db.collection('tasks').deleteOne(
	{
		description: 'Homework'		
	}).then((result) => {
		console.log(result)
	}).catch((error) => {
		console.log(error)
	}) 		
}) 

