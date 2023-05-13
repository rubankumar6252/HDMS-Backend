import express from "express"
import { getTask } from "../controller/subAdminController.js";
import { adminLogin } from "../controller/adminController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const route = express();

route.post("/subadmin/login", adminLogin);
route.get("/task", [auth, admin], getTask);

export default route;