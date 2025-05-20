import { RedisClientType } from "redis";
import { Users } from "../types/users";
import { RoomManager } from "../Rooms/RoomMangament";
import { v4 as uuidv4 } from 'uuid'
import type { WebSocket } from 'ws'
import { userInfo } from "os";

function joinRoom(roomId: string, user: Users, socket: WebSocket) {
    RoomManager.getInstance().insertUserToRoom(roomId, user, socket);
    RoomManager.getInstance().publishToRoom(roomId, `New user ${user.name} joined to room : ${roomId}`, user.id)

}

function createRoom(user: Users, socket: WebSocket) {
    const roomId = uuidv4()
    RoomManager.getInstance().insertUserToRoom(roomId, user, socket)
    socket.send(`New room created id : ${roomId}`)
    RoomManager.getInstance().publishToRoom(roomId, `New  room created : ${roomId}`)

}

function handleRoomChat(roomId: string, user: Users, message: string) {
    RoomManager.getInstance().publishToRoom(roomId, `${user.name} : ${message}}`, user.id)
}


function handleExit(roomId : string, user:Users,)
{
    RoomManager.getInstance().removeUserFromRoom(roomId,user.id)
    RoomManager.getInstance().publishToRoom(roomId,`${user.name} exited from group : `,user.id)
}


function handleDisconnect(ws : WebSocket)
{
    const userInfo = RoomManager.getInstance().getUserRoomBySocket(ws)

    if(userInfo)
    {
        const {roomId,userId} = userInfo

        const user = RoomManager.getInstance().getRoomUsers(roomId,userId)
        if(user)
        {
             handleExit(roomId,user)
        }
    }
}

export const WebSocketHandler = {
    joinRoom,
    createRoom,
    handleRoomChat,
    handleExit,
    handleDisconnect
}