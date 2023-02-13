import { z } from "zod";

export const bookSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  author: z
    .string({ required_error: "Author is required" })
    .min(5, { message: "Author must be 5 or more characters long" }),
  datePublished: z.coerce.date({ required_error: "Date published is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, { message: "Description must be 5 or more characters long" }),
  pageCount: z.number({ required_error: "Page count is required" }),
  genre: z.string({
    required_error: "Genre is required",
  }),
  publisher: z.string({
    required_error: "Publisher is required",
  }),
});
