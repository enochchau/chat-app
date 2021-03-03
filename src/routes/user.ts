import express from 'express';
import * as db from '../models/index';

const router = express.Router();

// add a friend
router.post('/', async (req, res, next) => {
  if (!req?.user?.id || !req.body.friendId) return res.sendStatus(400);
  // can't add yourself
  if (req.user.id === req.body.friendId) return res.sendStatus(400);

  try {

    const user = await db.User.findByPk(req.user.id, {
      include: [db.User.associations.Friends]
    });
    if (!user) return res.sendStatus(400);

    // const friendlist = user.getFriends();
    // console.log(friendlist);

    console.log(JSON.stringify(user, null,2));
    res.json(user);

    // const friend = await User.findByPk(req.body.friendId);
    // if (!friend) return res.sendStatus(400);

    // await user.addFriend(friend.id);

    // const updatedUser = await User.findByPk(req.user.id, {
    //   include: User.associations.friends,
    // });
    // if (!updatedUser ) return res.sendStatus(400);
    

    // res.json(updatedUser);

  } catch(err) {
    next(err);
  }
});

// delete a friend
router.delete('/', async (req, res, next) => {
  if(!req?.user?.id || !req.body.friendId) return res.sendStatus(400);

  try{
    const user = await db.User.findByPk(req.user.id, {
      include: db.User.associations.Friends,
    });
    if(!user) return res.sendStatus(400);


    console.log(user.Friends);
    res.json(user.Friends);

    // let enemy = await User.findByPk(req.body.friendId);
    // if(!enemy) return res.sendStatus(400);

    // user.removeUser(enemy);
  } catch(err) {
    next(err);
  }
})

export default router;