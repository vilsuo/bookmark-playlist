FROM node:20.11

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . .

# accept the environment variables from outside
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Note the extra parameters -- --host in the CMD. Those are needed
# to expose the development server to be visible outside the Docker
# network. By default the development server is exposed only to
# localhost, and despite we access the frontend still using the
# localhost address, it is in reality attached to the Docker network.
#CMD ["npm", "run", "dev", "--", "--host"]