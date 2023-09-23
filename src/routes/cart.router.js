import { Router } from 'express'
import CartManager from '../DAO/fileManager/cart.manager.js'
import cartModel from '../DAO/mongoManager/models/cart.model.js'


const router = Router()
const cartModel = new cartModel()

router.get('/', async (req, res) => {
    const result = await cartModel.list()
    res.send(result)
})

router.get('/:idc/:idp', async (req, res) => {
    const idc = parseInt(req.params.idc)
    const idp = parseInt(req.params.idp)

    const result = await cartModel.addProduct(idc, idp)
    res.send(result)
})

router.post('/', async (req, res) => {
    const result = await cartModel.create()
    res.send(result)
})

router.get('/cart', async(req, res) => {
    
})
export default router
