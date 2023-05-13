import express from "express";
import { login, myTicket, viewComment, createTicket } from "../controller/userController.js";
// import userAuth from '../middleware/userauth.js';
import auth from "../middleware/auth.js";
const route = express.Router()

route.post('/user/login', login);
route.post("/create/user/ticket", auth, createTicket);
route.get('/my/ticket', auth, myTicket);
route.get('/view/comment/:complaint_id', auth, viewComment);

export default route;