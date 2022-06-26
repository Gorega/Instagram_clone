import {Server} from "socket.io";

export default function handler(req,res){
            const io = new Server(res.socket.server)
            res.socket.server.io = io

            const users = [];

            const addUser = (userId,socketId)=>{
            return !users.some((user)=> user.userId === userId) && users.push({userId,socketId});
            }

            const removeUser = (socketId)=>{
            return users.filter((user)=> user.socketId !== socketId);
            }

            const getUser = (userId)=>{
            return users.find(user=> user.userId === userId);
            }

            // on io connection
            io.on("connection",(socket)=>{
                console.log("user connected !")
                // add userId and socketId
                socket.on("addUser",(userId)=>{
                addUser(userId,socket.id);
                io.emit("getUsers",users);
                })

                // send and get conversations
                socket.on("addConversation",({sender,receiverId})=>{
                    io.emit("getConversation",{
                        sender,
                        receiverId
                    })
                })

                //send and get message
                socket.on("sendMessage",({sender,receiverId,text})=>{
                const user = getUser(receiverId);
                io.emit("getMessage",{
                    sender,
                    text
                })
                })

                // send and get message notifcation
                socket.on("addMessageNotification",({receiverId})=>{
                    io.emit("getMessageNotification",{
                        receiverId
                    })
                })

                // like and unlike posts
                socket.on("addLike",({postId,userId})=>{
                    io.emit("getLike",{
                        postId,
                        userId
                    })
                })
                
                // on io disconnection
                socket.on("disconnect",(socket)=>{
                console.log("user disconnected !")
                // remove user from users array
                removeUser(socket.id);
                io.emit("getUsers",users);
                })
            })

      res.end()
}