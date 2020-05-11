import * as express from 'express';
import index from "./index";


const router = express.Router();

router.use('/', index);


export default router;