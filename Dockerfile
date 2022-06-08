FROM node:12

WORKDIR /app

# RUN npm install -g yarn
# Install Truffle
# RUN npm install -g truffle
# RUN npm config set bin-links false

# Move Contract Files
COPY migrations ./migrations
COPY test ./test

# Move React Files
COPY public ./public
COPY scripts ./scripts
COPY src ./src
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY truffle-config.js ./truffle-config.js

# Clean Install NPM Dependencies
RUN npm install
EXPOSE 4001

COPY .env ./.env
COPY ./docker-entrypoint.sh /tmp/entrypoint.sh
RUN chmod 0777 /tmp/entrypoint.sh

ENTRYPOINT ["/tmp/entrypoint.sh"]
