import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnect from "./libs/mongoose.js";
import allRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
const app = express();



app.use(cors({
  origin: "*",
  // origin: "https://lmtechub-quizy.netlify.app÷",
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api", allRouter);



// const mailOptions = {
//   from: "LMtechub.com",
//   to: "chiemelapromise30@gmail.com",
//   subject: "Invitation for a Quiz",
//   html: inviteTemplate('quizid', 'title')
// };

// app.post('/mail', (req, res)=>{
//   try {
//     sendMail(mailOptions)
//   } catch (error) {
    
//   }
//   res.send('mail sent')
// })

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = {}
let users = []

let connections = new Map()
let arrConnections = []
const connectedUsers = []

wss.on("connection", (ws) => {
  // console.log("connected");

  ws.on("message", (message) => {
    const {type, data} = JSON.parse(message)
    switch (type) {
      case 'init':
          // if(!users.some(d=> d.id === data.id)){
            if(!connectedUsers.includes(data.id)){
              connections.set(data.id, ws)
              // connections.set(data.id + "-" + data.role, ws)
              connectedUsers.push(data.id)
            }
            arrConnections = [...connections]
            // users.push(data)
            // clients[data['id']] = data
          // }
          // redis.sadd('users', data.id)
        break;
      case 'live-quiz':
          // connections.forEach((conn, userId)=> {
          //   console.log(userId)
          //   conn.send(data)
          // })
          // console.log(data, 'from the live quiz')
          wss.clients.forEach(client=>{
            client.send(JSON.stringify(data))
          })
        break;
      case 'logout':
        arrConnections.forEach(conn=>{
          const userSocketId = conn[0]
          const userExists = connectedUsers.includes(userSocketId)
          console.log(userExists)
          if(userSocketId){
            connections.delete(userSocketId)
          }
        })
        arrConnections = [...connections ]
        break
      default:
        console.log('an unknown message received!')
    }
    // console.log('e show', users)
    // redis.smembers('users', (err, members)=> {
    //   if(!err){
    //     console.log(members)
    //   }
    // })
    // console.log(data);
  });

  ws.on('close', (userId)=>{
    console.log('user disconnected')
  })
});


server.listen(PORT, () => {
  dbConnect();
  console.log(`Server running at PORT ${PORT}`);
});

function sendMessageToUser(userId, message){
  const ws = connections.get(userId)
  if(ws && ws.readyState == 1){
    ws.send(message)
  }
}


