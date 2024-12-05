# Step 1: Use Node.js to build the application
FROM node:16 as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application into the container
COPY . .

# Build the container application using Webpack
RUN npm run build

# Step 2: Use Nginx to serve the built files
FROM nginx:alpine as production-stage

# Copy the custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the previous stage to Nginx's serving directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
