import { Router } from "express";
import ProductManager from '../DAO/fileManager/product.manager.js'
import productModel from "../DAO/mongoManager/models/product.model.js"
import cartModel from '../DAO/mongoManager/models/cart.model.js'
import userRouter from './session.route.js'


const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
    const page = parseInt(req.query?.page || 1)
    const limit = parseInt(req.query?.limit || 10)
    const sort = req.params.sort || 'asd'
    const queryParams = req.query?.query || ''
    const query = {}
    if(queryParams) {
        const field = queryParams.split(',')[0]
        let value = queryParams.split(',')[1]

        if(isNaN(parseInt(value))) value = parseInt(value)

        query(field) = value
    }
    const result = await productModel.paginate(query, {
        page,
        limit,
        lean: true,
        sort
    })

    result.prevLink = result.hasPrevPage ? `/?page=${result.prevPage}&limit=${limit}` : ''
    result.nextLink = result.hasNextPage ? `/?page=${result.nextPage}&limit=${limit}` : ''

    res.render('products', result)
})


router.get('/', async (req, res) => {
    const products = await productManager.list()
    res.render('products', { products })
})

router.get('/products-realtime', async (req, res) => {
    const products = await productManager.list()
    res.render('products_realtime', { products })
})

router.get('/form-products', async (req, res) => {
    res.render('form', {})
})

router.post('/form-products', async (req, res) => {
    const data = req.body
    const result = await productModel.create(data)

    res.redirect('/')
})

router.get('/chat', async(req, res) => {
    const message = req.body
    res.render('chat', {})
})

router.get('/cart/:cid', async(req, res) => {
    const cartId = req.params.cid
    const cart = await cartModel.findById(cartId).populate('products.products_id').lean().exec()
    res.render('cart', {cart})
})

router.get('/cart', async (req, res) => {
    const carts = await cartModel.find().lean().exec()
    res.render('cart', {})
})
export default router