FROM node:8.2

WORKDIR /usr/src/app
COPY . .
RUN npm install

EXPOSE 8000
EXPOSE 48899
VOLUME /usr/src/app/src/config
CMD [ "npm", "start" ]
