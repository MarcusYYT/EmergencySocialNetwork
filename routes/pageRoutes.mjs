import express from 'express';

const router = express.Router();
router.get('/', (req, res) => {
    res.render('Home');
});
router.get('/directory/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    res.render('Directory', {user_id: user_id});
});
router.get('/messageWall/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    res.render('MessageWall', {user_id: user_id});
});

router.get('/privatePosts/:senderId/:receiverId', (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    res.render('PrivateChat', {senderId: senderId, receiverId: receiverId});
});

router.get('/test', (req, res) => {
    res.render('Test');
})
router.get('/socket', (req, res) => {
    res.render('socketTest');
})

export default router;
