

Install dependencies
```
yarn
```

Compile code
```
yarn dev
```

Start app
```
yarn start
```


## Starting app with Docker

Build docker image
```
docker build -t image-name .
```

Run image in interactive mode
```
docker run -it -p 4000:4000 image-name
```

Book Library App
This is a book library app that allows authorized users to create, read, update, and delete books. Users can create an account, log in with their credentials, and receive a JSON Web Token (JWT) for authentication.

Technologies Used
The app was built using Node.js, Express, and MongoDB. JWT was used for authentication, and bcrypt was used for password hashing.

Getting Started
To get started with the app, clone the repository and run npm install to install all dependencies. Then, create a .env file with your environment variables (such as the database connection string and the JWT secret).

To start the server, run npm start. The server will be listening on port 3000 by default.

User Creation
To create a user, send a POST request to /users with the user's information (name, email, and password). The password will be hashed using bcrypt before being saved to the database.

User Authentication
To log in, send a POST request to /users/login with the user's email and password. If the credentials are correct, the server will respond with a JWT, which can be used to authenticate subsequent requests.

Book Creation
To create a book, send a POST request to /books with the book's information (title, author, and description) and the JWT in the Authorization header. Only authorized users can create books.

Book Updating
To update a book, send a PATCH request to /books/:id with the book's ID and the updated information in the request body. The JWT must be included in the Authorization header.

Book Deletion
To delete a book, send a DELETE request to /books/:id with the book's ID and the JWT in the Authorization header. Only authorized users can delete books.

Conclusion
This app provides a simple and secure way for authorized users to perform CRUD operations on a book library. It uses modern technologies and best practices to ensure reliability and security.
