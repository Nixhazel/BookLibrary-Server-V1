export interface UserDataType {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookDataType {
  id: string;
  userId: string;
  title: string;
  author: string;
  datePublished: Date;
  description: string;
  pageCount: number;
  genre: string;
  publisher: string;
  createdAt: string;
  updatedAt: string;
}


export interface ErrorType {
  message: string;
}
