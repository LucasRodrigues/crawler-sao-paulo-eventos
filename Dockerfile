FROM node:latest

ENV APP_HOME /app
ENV HOST 0.0.0.0
ENV PORT 8000

WORKDIR $APP_HOME

COPY package.json package.json
RUN npm install --silent

EXPOSE 8000
