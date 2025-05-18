# WebSocket Pub/Sub Example

An example implementation of a scalable WebSocket server using Redis Pub/Sub to enable real-time communication across distributed instances—effectively avoiding sticky sessions.

## ✨ Features

- 🧠 **Room Management**: Create and join rooms with user context.
- 🔄 **Real-time Messaging**: Chat functionality within rooms.
- ⚡ **Scalable Architecture**: Redis Pub/Sub used to broadcast messages across all server instances.
- 🌐 **Express Integration**: HTTP server set up for WebSocket upgrades.
- 📤 **Horizontal Scalability**: Users connected to different WebSocket server instances can still receive messages in the same room via Redis Pub/Sub—no sticky sessions required.

---

## 🗂 Project Structure

```
src/
├── index.ts                 # Entry point: HTTP + WebSocket server setup
├── Rooms/
│   └── RoomMangament.ts     # RoomManager class: handles room/user/socket management
├── Websocket/
│   └── socketHandler.ts     # Handlers for join, create, and chat events
└── types/
    ├── users.ts             # Type definition for user object
    └── socketdata.ts        # Type definition for incoming WebSocket messages
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommended)
- A running Redis server (local or remote)

### 📦 Installation

```bash
npm install
```

### 🏃 Running the Server

```bash
npm run dev
```

- The WebSocket and HTTP server will be available at port 5000.
- Ensure Redis is running **before** starting the server.

---

## 💬 WebSocket Message Protocol

Connect to `ws://localhost:5000` and send messages in the following JSON format:

### 🔨 Create Room

```json
{
  "type": "create",
  "user": {
    "id": "user-id",
    "name": "User Name"
  }
}
```

### 👥 Join Room

```json
{
  "type": "join",
  "roomId": "room-id",
  "user": {
    "id": "user-id",
    "name": "User Name"
  }
}
```

### 💬 Send Chat Message

```json
{
  "type": "chat",
  "roomId": "room-id",
  "user": {
    "id": "user-id",
    "name": "User Name"
  },
  "message": "Hello!"
}
```

---

## 📌 Notes

- This setup is designed for **horizontal scaling**.
- WebSocket clients can be connected to any instance, and Redis ensures proper message delivery to all participants in a room.
- Ideal for use cases like chat apps, collaborative tools, and real-time dashboards.

---

## 🪪 License

ISC

---

## 👨‍💻 Author

**Jayakrishnan S**