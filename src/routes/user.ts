import express from 'express';
import { User } from '../models/index';
import passport from 'passport';

const router = express.Router();

// add a friend
router.post('/', async (req, res, next) => {
  passport.authenticate('jwt', {session: false})
  if (!req.user.id || !req.body.friendId) return res.sendStatus(400);

  try {

    let user = await User.findOne({where: {name: req.user.id}});
    if (!user) return res.sendStatus(400);

    let friend = await User.findOne({where: {name: req.body.friendId}});
    if (!friend) return res.sendStatus(400);

    user.addUser(friend);

    let result = await User.findOne({
      where: {name: req.user.id},
      include: User.associations.users
    });

    res.json(result);

  } catch(err) {
    next(err);
  }
});

export default router;