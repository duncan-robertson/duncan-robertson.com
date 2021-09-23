FROM node:lts

RUN mkdir -p /opt/duncan-robertson.com
WORKDIR /opt/duncan-robertson.com

# Copies the repo files from the build context into the image
COPY . .

RUN npm install
RUN npm run build-release

EXPOSE 80

CMD ["env", "PORT=80", "node","server.js"]
