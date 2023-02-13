FROM node:16-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
COPY bin bin
# copy source code to /app/src folder
COPY src /app/src

# check files list
RUN ls -a

RUN yarn
RUN yarn dev

EXPOSE 4000

CMD [ "node", "bin/www" ]