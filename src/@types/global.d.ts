interface IAction {
  type: string;
  payload?: any;
}

interface IBlog {
  Type: "ADD_BLOG"
  UUID: string;
  Title: string;
  Body: string;
  Creator: string;
  Followers: string[];
  CID?: string;
  Date?: Date;
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
  Blogs: IBlog[];
  Users: { [key: string]: IUser; };
}
