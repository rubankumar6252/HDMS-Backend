import Ticket from "../model/TicketShema.js";
import Admin from "../model/AdminSchema.js";
import User from "../model/UserSchema.js";
import Task from "../model/TaskSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const adminRegister = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;

    try {
        const exist_user = await Admin.findOne({ email: email })
        if (exist_user) return res.send("User Already Exist")
        const gen_salt = 10;
        bcrypt.hash(password, gen_salt, async (err, hash) => {
            const data = await Admin.insertMany({
                email,
                password: hash,
                role: role
            })
            if (data) return res.send('User Registered Successfully')
            console.log(data);
        })
    } catch (error) {
        return res.send(error.message)
    }
}

const adminLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;
    try {
        let data;
        if (role === 'admin') {
            data = await Admin.findOne({ email: email, role: 'admin' });
        } else {
            data = await Admin.findOne({ email: email, role: 'subadmin' });
        }
        if (data) {
            bcrypt.compare(password, data.password, async function (err, result) {
                if (err) {
                    return res.send("Invalid Email id or Password")
                }
                if (result) {
                    const token = jwt.sign({ _id: data._id, role: data.role }, process.env.SECRET_KEY);
                    return res.send({ token: token });
                } else {
                    return res.send("Invalid Email id or Password")
                }
            })
        } else {
            return res.send("User Not Found!")
        }
    } catch (error) {
        return res.send(error.message)
    }
}

const userRegister = async (req, res) => {
    let { regno, department, name, email, password } = req.body;

    try {
        const checkRegno = await User.findOne({ regno: regno });
        const checkEmail = await User.findOne({ email: email });
        if (checkRegno && checkEmail) return res.send("Email and Reg no already exist");
        if (checkEmail) return res.send("Email already exist");
        if (checkRegno) return res.send("Reg no already exist");

        const gen_salt = 10;
        bcrypt.hash(password, gen_salt, async function (err, hash) {
            const data = await User.insertMany({
                regno,
                department,
                name,
                email,
                password: hash
            })
            if (data) return res.send('User Registered Successfully')
        })
    } catch (error) {
        return res.send(error.message)
    }
}

const userTicket = async (req, res) => {
    try {
        const data = await Ticket.find({});
        if (data) {
            res.send(data);
        }
        else {
            return res.send("Data is empty")
        }
    }
    catch (error) {
        return res.send(error.message)
    }
}

const updateStatus = async (req, res) => {
    try {
        const { status, comment } = req.body;
        const complaint_id = req.params.complaint_id;

        const statusData = await Ticket.findOneAndUpdate({ complaint_id: complaint_id }, { $set: { status: status } }, { new: true });
        // this is update the ticket schema
        const user = await Ticket.findOne({ complaint_id: complaint_id });
        const commentData = { comment, complaint_id };
        user.comments.push(commentData);
        await user.save();
        // this is update the task schema
        const taskData = await Task.findOneAndUpdate({ "tasks.complaint_id": complaint_id }, { $set: { "tasks.$.status": status } }, { new: true });
        const task = await Task.findOne({ "tasks.complaint_id": complaint_id })
        // console.log(task);
        task.tasks[0].comments.push(commentData);
        await task.save();

        if (statusData && taskData) {
            res.send({ statusData, taskData });
        }
        else {
            return res.send("status not updated")
        }
    }
    catch (error) {
        return res.send(error.message)
    }
}

const manageUser = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.send(allUsers);
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params._id;
        const delUser = await User.findByIdAndDelete({ _id: id });
        res.send(delUser);
    } catch (err) {
        console.error(err);
        res.send("error");
    }
};


const manageSubAdmin = async (req, res) => {
    try {
        const data = await Task.find();
        if (data) {
            res.send(data);
        }
    } catch (err) {
        console.error(err);
    }
}

const subAdminTask = async (req, res) => {
    const ticketId = req.params.ticketId;

    try {
        const task = await Task.findOne({ "tasks.complaint_id": ticketId });
        if (task) {
            res.json({ taskAssigned: true });
        } else {
            const data = await Ticket.find({ complaint_id: ticketId });
            const newTask = {
                complaint_id: data[0].complaint_id,
                email: data[0].email,
                department: data[0].department,
                priority: data[0].priority,
                problem: data[0].problem,
                status: data[0].status,
                comments: data[0].comments,
                createdAt: data[0].createdAt
            };
            await Task.insertMany({ tasks: newTask });
            res.json({ taskAssigned: false });
        }
    } catch (err) {
        console.error(err);
        res.send("Error");
    }
}

export {
    adminLogin,
    adminRegister,
    userTicket,
    updateStatus,
    userRegister,
    subAdminTask,
    manageSubAdmin,
    manageUser,
    deleteUser
};