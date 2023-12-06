FROM node:14.16-buster
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ARG ENV

ARG http://localhost:8001
ENV http://localhost:8001 http://localhost:8001

ARG ws://localhost:8001/ws/
ENV ws://localhost:8001/ws/ ws://localhost:8001/ws/

COPY . ./

RUN bash -c "cd /app && npm install"
RUN echo "**********************RUNNING IN" $ENV "MODE**********************" \