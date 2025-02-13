# Use Node.js to build the frontend
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire frontend source code and build it
COPY . .
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the built frontend files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
