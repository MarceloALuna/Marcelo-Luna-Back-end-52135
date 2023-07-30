import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from "mongoose"
import { Server } from 'socket.io'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './DAO/fileManager/product.manager.js'
import __dirname from './utils.js'

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://marceloaluna:marceloaluna1988@clusterml.2fhj61b.mongodb.net/")

const httpServer = app.listen(8080)
const io = new Server(httpServer)

io.on('connection', socket => {
    socket.on('new-product', async data => {
        const productManager = new ProductManager()
        await productManager.create(data)

        const products = await productManager.list()
        io.emit('reload-table', products)
        
    })
})