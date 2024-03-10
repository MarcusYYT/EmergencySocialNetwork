import express from 'express';
import passport from '../config/passportConfig.mjs';

const router = express.Router();
router.get('/', (req, res) => {
    res.render('Home');
});
router.get('/directory/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('Directory', {user_id: user_id});
    }
});
router.get('/messageWall/:user_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    if (user_id != req.params.user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('MessageWall', {user_id: user_id});
    }
});

router.get('/privatePostsWall/:senderId/:receiverId', passport.authenticate('jwt', { session: false }), (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    if (senderId != req.user.data[0].user_id) {
        res.status(401).json({message: "Unauthorized access."});
    }
    else {
        res.render('PrivateChat', {senderId: senderId, receiverId: receiverId});
    }
});

router.get('/test', (req, res) => {
    res.render('Test');
})
router.get('/socket', (req, res) => {
    res.render('socketTest');
})

export default router;
