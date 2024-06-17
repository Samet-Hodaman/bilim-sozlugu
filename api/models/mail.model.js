import mongoose from 'mongoose'

const mailSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "Bilinmeyen kullanıcı"
    },
  },
  { timestamps: true }
)

const Mail = mongoose.model('Mail', mailSchema)

export default Mail