import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { create, deleteMail, editMail, getMails } from '../controllers/mail.controller.js'

const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/:mailId', getMails)
router.delete('/:mailId', verifyToken, deleteMail)
router.put('/:mailId', verifyToken, editMail)
export default router