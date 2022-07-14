FROM node:16

# Create app directory
WORKDIR /usr/src/app

ENV MONGODB_URL="mongodb+srv://ngochienhv:tan01692036796@dsv-bblog.qkmnlgz.mongodb.net/?retryWrites=true&w=majority"
ENV TOKEN_KEY="hoagxuH7JcjuewVfWwFKUZl0pPKjnuIg9r4+cPnsp6yGacaWBo5OFjAhXZjZLfJJrYQG7EHAiJyBZZiUTRgxGpPHCjGrpqsBJ9jqLJGeArQUkO2+0h1cwSQslOijzyjsMOGh2MWrmjdD3fkTKdFWo2o6FWw67IiLoo4qgtN0EIosPvF4xSYAaSrfGHuP0k6NCIPjLYYKa6tx6MT18ICWu96dz4IIUo3nK23oiAshdhluW3MJauKDPtlGsXs82v2P8+e4W99lwB1j0j8K9wojIax4NQRp2uqKAm+OQDbpekZkakL2K6yr2l5VkibP1n2rfS1MUOohYlhLoUrnXZp5lQ=="

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .
RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]
