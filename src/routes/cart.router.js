import { Router } from 'express'
import CartManager from '../DAO/fileManager/cart.manager.js'
import cartModel from '../DAO/mongoManager/models/cart.model.js'


const router = Router()

router.get('/', async (req, res) => {
    const findCart = await cartModel.find()
    res.send(findCart)
})

router.get('/', async (req, res) => {
    const result = await cartModel.list()
    res.send(result)
})

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid
    try {
        const cart = await cartModel.getCartById(cartId).populate('products')
        res.status(200).json({status: 'succes', cart})
    } catch (error) {
        res.status(500).json({error: 'Error al tratar de obtener el carrito'})
    }
})

router.get('/:cid/:idp', async (req, res) => {
    const cid = parseInt(req.params.cid)
    const idp = parseInt(req.params.idp)

    const result = await cartModel.addProduct(cid, idp)
    res.send(result)
})

router.post('/', async (req, res) => {
    const result = await cartModel.create({ products: []})
    res.send(result)
})

router.post('/:cid/:idp', async (req, res) => {
    const cid = req.params.cid
    const idp = req.params.idp
    const quantity = req.params.quantity || 1

    try {
        const cart = await cartModel.findById(cid)
        if(!cart) {
            return res.status(404).send({
                error: 'Cart not found'
            })
        }
        cart.products.push({
            product_id: idp,
            quantity
        })

        const result = await cart.save()

        res.send(result)
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error: 'Error al agregar un producto al carrito'
        })
    }
})

router.delete('/:cid/products/:idp', async (req, res) => {
    const cartId =req.params.cid
    const productId = req.params.idp
    try {
        await cartModel.removeProductFromCart(cartId, productId);
        res.status(200).json({ message: 'Poductos borrados correctamente'})

    } catch (error) { 
        res.status(500).json({ message: 'Error al tratar de borrar el producto'})}
})

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid
})

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid
    const products = req.body.products
    try {
        await cartModel.updateCart(cartId, products)
        res.status(200).json({messasge: 'Cart updated correctly'})
    } catch (error) {
        res.status(500).json({error: 'Error al tratar de obtener el carrito'})
    }
})

router.put('/:cid/products/:idp', async (req, res) => {
    const cartId =req.params.cid
    const productId = req.params.idp
    const quantity = parseInt(req.body.quantity)

    try {
        await cartModel.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json({ message: 'Poducto sumado correctamente'})

    } catch (error) { 
        res.status(500).json({ message: 'Error al tratar de sumar el producto'})}
})

export default router
