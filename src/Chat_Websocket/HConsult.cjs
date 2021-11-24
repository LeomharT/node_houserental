const io = require("socket.io")(3066, {
    cors: {
        origin: "*"
    }
});
let adminRoomId = undefined;
//io.on 只有connection然后返回的socket对象作为后续操作的前提
io.on("connection", (socket) =>
{
    console.log("clientid:" + socket.id);
    if (adminRoomId)
    {
        //有新用户进来全部再广播一遍
        io.emit('receive-adminroom', adminRoomId);
    }
    socket.on("message", (message, room, userId) =>
    {
        //发送给io对象下面所有的socket
        // io.emit("receive-message", message);
        //发送给其他所有socket
        if (room)
        {
            socket.to(room).emit("receive-message", message, userId);
        } else
        {
            socket.broadcast.emit("receive-message", message);
        }
    });
    socket.on("voice-message", (message, room, socketId) =>
    {
        if (room)
        {
            socket.to(room).emit("receive-voicemessage", message, socketId);
        } else
        {
            socket.broadcast.emit("receive-voicemessage", message);
        }
    });
    socket.on("house-message", (hId) =>
    {
        socket.broadcast.emit("receive-housemessage", hId);
    });
    socket.on("sendAdminRoom", (adminRoom) =>
    {
        adminRoomId = adminRoom;
        socket.broadcast.emit("receive-adminroom", adminRoom);
    });

});
