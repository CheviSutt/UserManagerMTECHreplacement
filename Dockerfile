FROM node:latest
WORKDIR /code
# copies above file
COPY . /code
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]



