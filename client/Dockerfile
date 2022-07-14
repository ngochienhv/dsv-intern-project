FROM node:16

WORKDIR /usr/src/app

ENV REACT_APP_BASE_URL="http://localhost:5000/api"
ENV REACT_APP_IMGSV_API_KEY="cd799d5eb8748b4aa1bb1ab0a31955f3"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD [ "serve", "-s", "build" ]