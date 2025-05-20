import { Users } from "./users";

export type SocketDataType =
  | {
      user: Users;
      type: "create";
    }
  | {
      type: "join";
      user: Users;
      roomId: string;
    }
  | {
      type: "chat";
      roomId: string;
      user : Users
      message :string
    }
  |
  {
    type : "exit",
    roomId : string,
    user: Users
  }
