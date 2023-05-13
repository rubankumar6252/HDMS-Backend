import User from '../model/UserSchema.js';
import Ticket from '../model/TicketShema.js';
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();

const login = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    const data = await User.findOne({ email: email })
    if (data) {
      bcrypt.compare(password, data.password, async function (err, user) {
        if (user == true) {
          const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY)
          return res.send(token)
        }
        return res.send("Invalid Email id or Password")
      })
    }
    else {
      return res.send("User Not Found!")
    }
  } catch (error) {
    return res.send(error.message)
  }
}

const createTicket = async (req, res) => {
  // Complaint id generation
  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace(/\//g, '');
  const deptName = req.body.department.substring(0, 2).toUpperCase();
  const seriesNo = Math.floor(Math.random() * 100) + 1;
  const paddedSeriesNo = String(seriesNo).padStart(3, '0');
  const complaintID = `${currentDate}${deptName}${paddedSeriesNo}`;

  const userId = req.user._id;
  const user = await User.findById(userId);
  const emailValue = user.email;

  let complaint_id = complaintID;
  let email = emailValue;
  let department = req.body.department;
  let priority = req.body.priority;
  let problem = req.body.problem;
  let status = req.body.status;
  let createdAt = new Date();

  try {
    const ticketData = await Ticket.insertMany({
      complaint_id,
      email,
      department,
      priority,
      problem,
      status,
      createdAt
    })

    if (ticketData) {
      res.send("Ticket Submitted");
    } else {
      res.send("Error in ticket");
    }

    setInterval(async () => {
      await Ticket.updateOne({ _id: ticketData[0]._id }, { $set: { createdAt: new Date() } });
    }, 60 * 1000);

  } catch (error) {
    return res.send(error.message)
  }
}

const myTicket = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const email = user.email;
    const tickets = await Ticket.find({ email });

    if (tickets.length === 0) {
      return res.send("No tickets found");
    }

    res.send(tickets);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const viewComment = async (req, res) => {
  try {
    const complaint_id = req.params.complaint_id;
    const ticket = await Ticket.findOne({ complaint_id: complaint_id });

    const comments = ticket.comments;

    if (comments.length > 0) {
      const lastComment = comments[comments.length - 1];
      res.send(lastComment);
    } else {
      res.send("No comments found for the ticket");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { login, myTicket, viewComment, createTicket }