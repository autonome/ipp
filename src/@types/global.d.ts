interface IAction {
  type: string;
  payload?: any;
}

interface IBlog {
  Title: string;
  Body: string;
  Creator: string;
  Followers: string[];
  CID?: string;
  Date?: Date;
}

interface IUser {
  Name?: string;
  Email?: string;
  Wallet: string;
  Image?: string;
}

interface IDatabase {
  Blogs: string[];
  Users: IUser[];
}

interface IDatabaseAction {
  Type: "ADD_BLOG" | "ADD_USER";
  CID: string;
}
