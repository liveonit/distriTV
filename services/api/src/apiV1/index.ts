import { Router } from 'express';
import userRoute from './User/User.route';
import bookRoute from './Book/Book.route';
import authorRoute from './Author/Author.route';
import contentRoute from './Content/Content.routes'
import institutionRoute from './Institution/Institution.routes'
import labelRoute from './Label/Label.routes'
import notificationRoute from './Notification/Notification.routes'
import televisionRoute from './Television/Television.routes'

const router: Router = Router();

router.use('/user', userRoute)
router.use('/book', bookRoute);
router.use('/author', authorRoute);
router.use('/content', contentRoute);
router.use('/institution', institutionRoute);
router.use('/label', labelRoute);
router.use('/notification', notificationRoute);
router.use('/television', televisionRoute);
export default router;
