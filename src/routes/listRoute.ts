const express = require('express')
import { upload } from '../configs/multer'
import { addList, listById, lists, updateList, mediaUpload, deleteList, myListings } from '../controllers/listController'
import authUser from '../middlewares/authUser'

const listRouter = express.Router()

listRouter.get('', lists)
listRouter.get('/myListings', authUser, myListings)
listRouter.get('/:id', listById)
listRouter.post('', upload.none(), authUser, addList)
listRouter.put('/:id', upload.none(), authUser, updateList)
listRouter.post('/media/upload', upload.array('images'), authUser, mediaUpload)
listRouter.delete('/:id', authUser, deleteList)

export default listRouter
