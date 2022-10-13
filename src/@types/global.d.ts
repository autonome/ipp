interface IAction {
  type: string;
  payload?: any;
}

interface IBlog {
  Type: "ADD_BLOG" | "UPDATE_BLOG"
  UUID: string;
  Title: string;
  Body?: string;
  Creator: string;
  Followers?: string[];
  CID?: string;
  Date?: Date;
  BodyCID: string;
}

interface IUser {
  Type: "ADD_USER"
  Name?: string;
  Wallet: string;
  Image?: string;
  CID?: string;
  Date?: Date;
  Bio?: string;
}

interface IDatabase {
  Initialized: boolean;
  ipnsData: Number[];
  Blogs: IBlog[];
  Users: { [key: string]: IUser; };
  syncedVersion: number;
}
