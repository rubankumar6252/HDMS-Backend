import express from "express";
import { adminLogin, adminRegister, userTicket, updateStatus, userRegister, subAdminTask, manageSubAdmin, manageUser,deleteUser } from "../controller/adminController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const route = express.Router();

route.post('/admin/register', adminRegister)
route.post('/admin/login', adminLogin)
route.post('/admin/user/register', [auth, admin], userRegister);
route.get('/user/all/tickets', [auth, admin], userTicket)
route.get('/all/users', [auth, admin], manageUser);
route.delete('/delete/users/:_id', [auth, admin], deleteUser);
route.put('/ticket/status-update/:complaint_id', [auth, admin], updateStatus)
route.get('/manage/task', [auth, admin], manageSubAdmin);
route.post('/subadmin/task/:ticketId', [auth, admin], subAdminTask);
route.get('/subadmin/task/:ticketId', [auth, admin], subAdminTask);

export default route;