const mongoose = require('mongoose')



mongoose.connect(process.env.MONGODB_URL+'/task-manager-api?retryWrites=true&w=majority' ,{useNewUrlParser:true, useCreateIndex:true
})


