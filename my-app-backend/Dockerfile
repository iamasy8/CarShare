# my-app-backend/Dockerfile
FROM node:latest

WORKDIR /app

# Copy only package.json initially to install dependencies
COPY package.json ./

# Install Express and create package-lock.json
RUN npm install express

# Copy the rest of your application code
COPY . .

EXPOSE 3001 # Expose the port your Express app is listening on

CMD [ "node", "server.js" ]
