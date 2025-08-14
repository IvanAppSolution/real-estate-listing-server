// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose')

export interface IList {
    id: string
    name: string
    code: string
    userId: any // mongoose.Types.ObjectId
    description: string
    price: number
    images: string[]
    numBedroom: number
    numBathroom: number
    garage?: number
    area?: string
    yearBuilt?: number
    category: string
    propertyType: string
    propertyStatus: string
    inventoryStatus: string
    rating: number
    address: {
        street: string
        city: string
        state: string
        zip: string
        country: string
        mapUrl: string
    }
    contact: {
        name: string
        email: string
        phone: string
        others: string
    }
    createdAt: Date
    updatedAt: Date
}

const listSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    code: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    images: { type: Array },
    numBedroom: { type: Number, default: 0 },
    numBathroom: { type: Number, default: 0 },
    garage: { type: Number },
    area: { type: String },
    yearBuilt: { type: Number },
    category: { type: String, default: "residential" },
    propertyType: { type: String, default: "house" },
    propertyStatus: { type: String, default: "for rent" },
    inventoryStatus: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zip: { type: String, default: "" },
        country: { type: String, default: "" },
        mapUrl: { type: String, default: "" },
    },
    contact: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        others: { type: String, default: "" },
    }
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc: any, ret: any) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        }
    },
    toObject: { 
        virtuals: true,
        transform: function(doc: any, ret: any) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

const List = mongoose.models.list || mongoose.model('list', listSchema)

export default List
