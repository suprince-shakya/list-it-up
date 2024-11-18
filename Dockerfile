FROM node:20.17.0-alpine3.19

WORKDIR /app
COPY . .

# Delete the existing 'build' folder if it exists
RUN rm -rf build

RUN npm i

RUN npm run build
EXPOSE 8004

CMD ["npm", "start"]
