# Prototype Angular Site
This is code for a very simple personal website utilizing Angular. It utilizes a webpack for content bundling and Typescript/Angular compilation.

## Improvements To Do
- More content / features
- Unit Tests?

## How To Build & Run
You will need be using at least Node 12

1. npm install
2. npm run build
3. npm start

### Docker
Docker can also be used to build and run this website. To create an image the following command can be used

    docker build github.com/duncan-robertson/duncan-robertson.com -t duncan-robertson.com

Then an instance of the image can be run. The docker instance runs on port 80 internally which will need to be exposed for network access. For example this command will run an instance on port 9999

    docker run -d -p 9999:80 duncan-robertson.com