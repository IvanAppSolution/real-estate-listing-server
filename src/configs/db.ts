// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose')

const connectDB = async (): Promise<void> => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.error((error as Error).message)
    }
}

export default connectDB
