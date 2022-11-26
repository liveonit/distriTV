FROM node:18-alpine as build-stage

RUN apk add g++ make py3-pip

WORKDIR /app
COPY ./ /app/
RUN yarn
RUN yarn test
RUN yarn build --prod


FROM nginx:latest

COPY --from=build-stage /app/docs/ /usr/share/nginx/html
