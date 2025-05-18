import { RedisClientType } from "redis";
import { Users } from "../types/users";
import { RoomManager } from "../Rooms/RoomMangament";
import { v4 as uuidv4 } from 'uuid'
import type { WebSocket } from 'ws'

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

export const WebSocketHandler = {
    joinRoom,
    createRoom,
    handleRoomChat
}