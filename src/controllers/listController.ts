// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2
import List, { IList } from '../models/List'

interface AuthRequest {
    userId?: string
    body: any
    files?: any[]
}

interface ListRequest extends AuthRequest {
    body: {
        listData: string
        userId?: string
    }
}

interface UpdateListRequest extends AuthRequest {
    body: {
        id: string
        listData: string
    }
}

// Add list : /list/add
export const addList = async (req: any, res: any): Promise<void> => {
    try {
        const { listData } = req.body
        if (!listData) {
            res.json({ success: false, message: "List data is required" })
            return
        }
        
        const data = JSON.parse(listData)
        
        // Add the authenticated user's ID to the listing
        data.userId = req.userId || req.body.userId
        
        const response = await List.create({ ...data })
        res.json({ success: true, id: response.id, message: "List Added" })

    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Get List : /list
export const lists = async (req: any, res: any): Promise<void> => {
    try {
        const data = await List.find({})
        res.json({ success: true, data })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Get single List : /list/:id
export const listById = async (req: any, res: any): Promise<void> => {
    try {
        const { id } = req.params
        const data = await List.findById(id)
        res.json({ success: true, data })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

// Update List : /list/:id
export const updateList = async (req: any, res: any): Promise<void> => {
    try {
        const { id } = req.params
        let { listData } = req.body
        if (!id || !listData) {
            res.json({ success: false, message: "ID and list data are required" })
            return
        }

        const parsedId = JSON.parse(id)
        const parsedListData = JSON.parse(listData)
        await List.findByIdAndUpdate(parsedId, { ...parsedListData })
        res.json({ success: true, message: "List Updated" })
    } catch (error) {
        console.log((error as Error).message)
        res.json({ success: false, message: (error as Error).message })
    }
}

export const mediaUpload = async (req: any, res: any): Promise<void> => {
    try {
        if (!req.files || req.files.length === 0) {
            res.json({ success: false, message: "No files uploaded" })
            return
        }
        
        const images = req.files as Express.Multer.File[]
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )
        res.json({ success: true, data: imagesUrl })
    } catch (error) {
        console.error("Error uploading files:", error)
        res.json({ success: false, message: (error as Error).message })
    }
}

export const deleteList = async (req: any, res: any): Promise<void> => {
    try {
        const { id } = req.params
        if (!id) {
            res.json({ success: false, message: "ID is required" })
            return
        }
        
        const deletedList = await List.findByIdAndDelete(id)
        if (!deletedList) {
            res.json({ success: false, message: "List not found" })
            return
        }
        
        res.json({ success: true, message: "List deleted successfully" })
    } catch (error) {
        console.error("Error deleting list:", error)
        res.json({ success: false, message: (error as Error).message })
    }
}

export const myListings = async (req: any, res: any): Promise<void> => {
    try {
        const userId = req.userId || req.body.userId

        if (!userId) {
            res.json({ success: false, message: "User ID is required" })
            return
        }

        const listings = await List.find({ userId })
        if (!listings || listings.length === 0) {
            res.json({ success: false, message: "No listings found for this user" })
            return
        }

        res.json({ success: true, data: listings })
    } catch (error) {
        console.error("Error fetching user listings:", error)
        res.json({ success: false, message: (error as Error).message })
    }
}
