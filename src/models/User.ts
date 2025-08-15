import { IUser } from '../types'
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { 
    minimize: false,
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

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User
