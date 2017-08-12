FROM node:8.2
LABEL org.freenas.interactive="false" \
      org.freenas.version="0.1" \
      org.freenas.upgradeable="true" \
      org.freenas.expose-ports-at-host="true" \
      org.freenas.autostart="true" \
      org.freenas.web-ui-protocol="http" \
      org.freenas.web-ui-port=8000 \
      org.freenas.web-ui-path="" \
      org.freenas.port-mappings="8000:8000/tcp,48899:48899/udp" \
      org.freenas.volumes="[						\
          {								\
              \"name\": \"/usr/src/app/config\",					\
              \"descr\": \"Config storage space\"			\
          },								\
      ]" \
      org.freenas.settings="[ 						\
          {								\
              \"env\": \"TZ\",						\
              \"descr\": \"Timezone - eg Europe/London\",		\
              \"optional\": true					\
          },								\
      ]"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE 8000
EXPOSE 48899
CMD [ "npm", "start" ]
