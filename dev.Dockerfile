FROM node:current-buster
#RUN apt update && apt install nano 
WORKDIR /home/app
#RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN npm install nodemon -g
RUN npm install pm2 -g
EXPOSE 3000


ENTRYPOINT /bin/bash