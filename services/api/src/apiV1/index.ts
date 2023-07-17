import { Router } from 'express';
import authRoute from './Auth/Auth.routes';
import userRoute from './User/User.routes';
import contentRoute from './Content/Content.routes'
import institutionRoute from './Institution/Institution.routes'
import labelRoute from './Label/Label.routes'
import notificationRoute from './Notification/Notification.routes'
import televisionRoute from './Television/Television.routes'
import scheduleRoute  from './Agenda/Schedule.routes';
import AlertRoute from './Alert/Alert.routes';

const router: Router = Router();

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/content', contentRoute);
router.use('/institution', institutionRoute);
router.use('/label', labelRoute);
router.use('/notification', notificationRoute);
router.use('/television', televisionRoute);
router.use('/schedule',scheduleRoute);
router.use('/alert', AlertRoute)
export default router;
