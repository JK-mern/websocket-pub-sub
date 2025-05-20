import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { Users } from "../types/users";
import { WebSocket } from "ws";

export class RoomManager {
  private rooms: Map<string, Users[]>;
  private sockets: Map<string, Map<string, WebSocket>>;
  private redisClientSubscriber: RedisClientType;
  private redisClientPublisher: RedisClientType;
  private static roomInstance: RoomManager;
  private constructor() {
    this.rooms = new Map();
    this.redisClientSubscriber = createClient();
    this.redisClientPublisher = createClient();

    this.redisClientPublisher.connect();
    this.redisClientSubscriber.connect();
    this.sockets = new Map();
  }

  static getInstance() {
    if (!this.roomInstance) {
      this.roomInstance = new RoomManager();
    }
    return this.roomInstance;
  }

  insertUserToRoom(roomId: string, user: Users, ws: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, []);
      this.sockets.set(roomId, new Map());
    }

    this.rooms.get(roomId)!.push(user);
    this.sockets.get(roomId)!.set(user.id, ws);

    if (this.rooms.get(roomId)?.length === 1) {
      this.redisClientSubscriber.subscribe(roomId, (message) => {
        this.handleSubscriptionMessage(roomId, message);
      });
    }
  }

  async removeUserFromRoom(roomId: string, userId: string) {
    this.rooms.set(
      roomId,
      this.rooms.get(roomId)?.filter((user) => user.id !== userId) || []
    );

    this.sockets.get(roomId)!.delete(userId);

    if (this.rooms.get(roomId)?.length === 0) {
      await this.redisClientSubscriber.unsubscribe(roomId);
      this.rooms.delete(roomId);
      this.sockets.delete(roomId);
      console.log("All users removed and unsubscribed from room:", roomId);
    }
  }

  handleUserDisconnect(ws:WebSocket)
  {
     
  }

  getUserRoomBySocket (ws:WebSocket)
  {
    for(const [roomId, userMap] of this.sockets.entries())
    {
      for(const[userId, socket] of userMap.entries())
      {
        if(socket ===ws)
        {
          return {roomId, userId}
        }
      }
    }
  }

  handleSubscriptionMessage(roomId: string, rawMessage: string) {
    const sockets = this.sockets.get(roomId);
    const { message, excludedUserId } = JSON.parse(rawMessage);
    if (!sockets) return;

    for (let [userId, socket] of sockets) {
      if (excludedUserId !== userId && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    }
  }


  getRoomUsers (roomId : string, userId : string)
  {
    return this.rooms.get(roomId)?.find((user) => user.id === userId)
  }

  publishToRoom(roomId: string, message: string, excludedUserId?: string) {
    if (excludedUserId)
      this.redisClientPublisher.publish(
        roomId,
        JSON.stringify({ message, excludedUserId })
      );
  }
}
