import { Router } from 'express';
import userRoute from './User/User.route';
import bookRoute from './Book/Book.route';
import authorRoute from './Author/Author.route';
import institutionRoute from './Institution/Institution.routes'
const router: Router = Router();

router.use('/user', userRoute)
router.use('/book', bookRoute);
router.use('/author', authorRoute);
router.use('/institution', institutionRoute);

export default router;
