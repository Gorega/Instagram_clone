import {Server} from "socket.io";

export default function handler(req,res){
    if(!res.socket.server.io){
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
            // successful socket connection handler

            // add userId and socketId
            // socket.on("addUser",(userId)=>{
            // addUser(userId,socket.id);
            // io.emit("getUsers",users);
            // })

            // send and get conversations
            socket.on("addConversation",({sender,receiverId})=>{
                io.emit("getConversation",{
                    sender,
                    receiverId
                })
            })

            //send and get message
            socket.on("sendMessage",({conversationId,sender,text})=>{
            // const user = getUser(receiverId);
            io.emit("getMessage",{
                conversationId,
                sender,
                text
            })
            })

            // socket messenger patch
            socket.on("addMessengerPatch",({receiverId})=>{
                io.emit("getMessengerPatch",{
                    receiverId
                })
            })

            // socket converesations blocks
            socket.on("UnblockConversation",({conversationId})=>{
                io.emit("getUnblockedConversation",{
                    conversationId
                })
            })

            socket.on("blockConversation",({conversationId})=>{
                io.emit("getBlockedConversation",{
                    conversationId
                })
            })

            // socket likes
            socket.on("likes",({postId,userId})=>{
                io.emit("getLikes",{
                    postId,
                    userId
                })
            })

            // socket comments
            socket.on("comments",({postId,userId})=>{
                io.emit("getComments",{
                    postId,
                    userId
                })
            })

            // // socket new posts coming
            // socket.on("posts",(data)=>{
            //     io.emit("getNewPosts",{
            //         data
            //     })
            // })
            
            // on io disconnection
            socket.on("disconnect",(socket)=>{
            // faild socket connection handler

            // remove user from users array
            // removeUser(socket.id);
            // io.emit("getUsers",users);
            })
        })
    }else{
        // socket is already running handler
    }

res.end()
}