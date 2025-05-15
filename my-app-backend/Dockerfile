# my-app-backend/Dockerfile
FROM node:latest

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of your application code
COPY . .

EXPOSE 3001 

CMD [ "npm", "start" ]