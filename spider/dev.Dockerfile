FROM node:current-buster
#RUN apt update && apt install nano 
WORKDIR /home/app
#RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN npm install nodemon -g
#RUN yarn global add  jest
RUN yarn global add pta
EXPOSE 3202
RUN echo fs.inotify.max_user_watches=524288 |  tee -a /etc/sysctl.conf
RUN apt update
RUN apt install -y redis-tools
#RUN echo "192.168.0.12  x2 x2" >> /etc/hosts
#RUN echo "192.168.0.111  x1 x1" >> /etc/hosts

ENTRYPOINT /bin/bash