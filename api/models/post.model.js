import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/bilim-sozlugu.appspot.com/o/Wallpaper.png?alt=media&token=e5e86001-bae4-4bc1-996a-fdbe2509f76d',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema);

export default Post