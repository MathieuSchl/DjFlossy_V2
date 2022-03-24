FROM node

COPY ./package*.json /home/node/DjFlossy/
WORKDIR /home/node/DjFlossy/
VOLUME ./storage/data
RUN npm install
COPY . .
