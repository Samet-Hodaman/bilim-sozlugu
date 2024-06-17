import Mail from '../models/mail.model.js'

export const create = async (req, res, next) => {
    if (!(req.user.isAdmin || req.user.isEditor)) {
      return next(errorHandler(403, 'You are not allowed to create a mail'))
    }
    if (!req.body.content) {
      return next(errorHandler(400, 'Please provide all required fields'))
    }
    const newMail = new Mail({
      ...req.body,
      userId: req.user.id,
    })

    try {
      const savedMail = await newMail.save()
      res.status(201).json(savedMail)
    } catch (error) {
      next(error)
    }
  }

export const editMail = async (req, res, next) => {
  try {
    const mail = await Mail.findById(req.params.mailId)
    if (!mail) {
      return next(errorHandler(404, 'Mail not found'));
    }
    if (mail.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to edit this mail')
      )
    }

    const editedMail = await Mail.findByIdAndUpdate(
      req.params.mailId,
      {
        content: req.body.content
      },
      { new: true }
    )
    res.status(200).json(editedMail)
  } catch (error) {
    next(error)
  }
}

export const deleteMail = async (req, res, next) => {
  try {
    const mail = await Mail.findById(req.params.mailId)
    if (!mail) {
      return next(errorHandler(404, 'Mail not found'))
    }
    if (mail.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this mail'))
    }
    await Mail.findByIdAndDelete(req.params.mailId)
    res.status(200).json('Mail has been deleted')
  } catch (error) {
    next(error)
  }
};

export const getMails = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === 'desc' ? -1 : 1
    const mails = await Mail.find({
      ...(req.query.userId && { userId: req.query.userId})
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalMails = await Mail.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthMails = await Mail.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })
    res.status(200).json({ mails, totalMails, lastMonthMails })
  } catch (error) {
    next(error)
  }
}