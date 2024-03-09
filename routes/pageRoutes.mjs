import express from 'express';
import passport from '../config/passportConfig.mjs';

const router = express.Router();
router.get('/', (req, res) => {
    res.render('Home');
});
router.get('/directory/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    res.render('Directory', {user_id: user_id});
});
router.get('/messageWall/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user_id = req.user.data[0].user_id;
    res.render('MessageWall', {user_id: user_id});
});

router.get('/test', (req, res) => {
    res.render('Test');
})
router.get('/socket', (req, res) => {
    res.render('socketTest');
})

export default router;
