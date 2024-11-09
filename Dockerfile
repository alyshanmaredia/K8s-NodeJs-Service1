FROM node:18
WORKDIR /outerapp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6000
CMD ["npm", "start"]