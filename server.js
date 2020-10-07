const express = require('express')
const mongo = require('mongoose')
const config = require('config')

const app = express()

app.use(express.json({extended:true}))

app.use('/user',require('./routes/user.routes'))
app.use('/admin',require('./routes/admin.routes'))
app.use('/auth',require('./routes/auth.routes'))
app.use('/post',require('./routes/post.routes'))

async function start(){
    try {
        await mongo.connect(config.get('mongoUrl'),{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        })
        app.listen(config.get('port'),console.log('start at'))
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }
}
start()
