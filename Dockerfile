FROM node:lts

WORKDIR /opt

RUN git clone https://github.com/duncan-robertson/duncan-robertson.com.git

WORKDIR /opt/duncan-robertson.com

RUN npm install
RUN npm run build-release

EXPOSE 80

CMD ["env", "PORT=80", "node","server.js"]
