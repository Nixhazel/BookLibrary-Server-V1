import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type { JwtPayload } from "jsonwebtoken"

import { BookDataType, ErrorType } from "../../typings";
import { createData, getAllData } from "../../utils";
import { removeObjectWithId } from "../../utils/removeObject";
import { verifyToken } from "../../utils/token";
import { bookSchema } from "../../utils/validation/books";

export const getAllBooks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getAllBooksData: BookDataType[] = getAllData("src/database/books.json");
    res.send({
      success: true,
      path: req.url,
      data: getAllBooksData,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};
export const getMyBooks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  try {
    const getAllBooksData: BookDataType[] = getAllData("src/database/books.json");
    const myBooks: BookDataType[] = getAllBooksData.filter((books: BookDataType) => books.userId === userId);
    res.send({
      success: true,
      path: req.url,
      data: myBooks,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};

export const getBook = (req: Request, res: Response, next: NextFunction) => {
  const getAllBooksData: BookDataType[] = getAllData("src/database/books.json");
  let id: string = req.params.id;
  try {
    let myBook = getAllBooksData.find((book) => book.id === id);
    if (!myBook) {
      return res.status(409).send({
        status: "error",
        path: req.url,
        message: `Book with the id - '${id}' does not exist`,
      });
    }

    res.status(201).send({
      status: "success",
      path: req.url,
      data: myBook,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const getAllBooksData: BookDataType[] = getAllData("src/database/books.json");
  const bookData = req.body;

  const error = bookSchema.safeParse(bookData);

  const authorization: any = req.headers.authorization;
  const token = authorization.split(' ')[1];

  const decoded = await verifyToken(token) as JwtPayload;

  try {
    if (error.success === false) {
      return res.status(400).send({
        success: false,
        path: req.url,
        message: error.error.issues[0].message,
      });
    }

    const getExistingBook = getAllBooksData.find(
      (book: { title: string }) => book.title === bookData.title
    );

    if (getExistingBook) {
      return res.status(409).send({
        status: "error",
        path: req.url,
        message: `Book with the title - '${bookData.title}' already exist`,
      });
    }

    const allBookData = {
      id: uuidv4(),
      userId: decoded.id,
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    getAllBooksData.push(allBookData);

    createData("src/database/books.json", getAllBooksData);

    res.status(201).send({
      status: "success",
      path: req.url,
      message: `Book with title - '${bookData.title}' added successfully`,
      data: allBookData,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};

export const editBook = (req: Request, res: Response, next: NextFunction) => {
  const getAllBooksData = getAllData("src/database/books.json");
  const bookData = req.body;
  let id = req.params.id;

  try {
    let myBook = getAllBooksData.find((book: any) => book.id === id);
    if (!myBook) {
      return res.status(409).send({
        status: "error",
        path: req.url,
        message: `Book with the id - '${id}' does not exist`,
      });
    };

    let updatedData = getAllBooksData.map((book: any) => {
      if (book.id === id) {
        return book = {
          id: book.id,
          userId: book.userId,
          title: book.title,
          author: book.author,
          datePublished: book.datePublished,
          description: book.description,
          pageCount: book.pageCount,
          genre: book.genre,
          publisher: book.publisher,
          createdAt: book.createdAt,
          updatedAt: new Date(),
          ...bookData
        }
      } else {
        return book;
      }
    })
    createData("src/database/books.json", updatedData);
    res.status(201).send({
      status: "success",
      path: req.url,
      message: `Book with id - ${myBook.id} has been updated successfully`,
      data: updatedData,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }

};

export const deleteBook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const getAllBooksData = getAllData("src/database/books.json");
  let id = req.params.id;
  try {
    let bookToDelete = getAllBooksData.find((book: any) => book.id === id);
    if (!bookToDelete) {
      return res.status(409).send({
        status: "error",
        path: req.url,
        message: `Book with the id - '${id}' does not exist`,
      });
    };
    let newBook = removeObjectWithId(getAllBooksData, id);

    createData("src/database/books.json", newBook);

    res.status(201).send({
      status: "success",
      path: req.url,
      message: `Book with title - '${bookToDelete.title}' has been deleted successfully`,
      data: bookToDelete
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};
