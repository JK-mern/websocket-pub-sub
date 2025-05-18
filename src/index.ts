import {WebSocketServer} from 'ws'
import express from 'express'
import { createServer } from 'http'
import { SocketDataType } from './types/socketdata'
import { createClient, RedisClientType } from 'redis'
import { WebSocketHandler } from './Websocket/socketHandler'

let serverPort = 5000

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })
let client = 0
const redisClient: RedisClientType = createClient()

wss.on('connection' , (ws) =>{

    console.log("A new client connected : ",  ++client)

    ws.on('message' , (rawdata) =>{
        const data = JSON.parse(rawdata.toString()) as SocketDataType
        switch(data.type)
        {
            case 'join':
                    WebSocketHandler.joinRoom(data.roomId, data.user, ws)
                    break
            case 'create' :
                 WebSocketHandler.createRoom(data.user,ws)
                 break
            case  'chat' :
                WebSocketHandler.handleRoomChat(data.roomId, data.user, data.message)
                break
        }
    })
})


async function start()
{
    await redisClient.connect()
    console.log("Redis client started")

    server.listen(serverPort, () => {
    console.log(`HTTP + WebSocket server listening on port ${serverPort}`)
  })

}

start()