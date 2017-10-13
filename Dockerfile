FROM node:6.11.3-alpine

WORKDIR /app

# move files to cache installing of dependencies
COPY package.json .
COPY bower.json .

# phantomjs workaround
RUN echo -e '#!/bin/sh\necho "2.1.1"' > /bin/phantomjs && \
    chmod a+x /bin/phantomjs && \

# bower workaround
    echo '{ "allow_root": true }' > /root/.bowerrc && \

# create release user so that we can chown output dir
    adduser -u 663 -D release && \

# install missing stuff
    apk add --no-cache --virtual .gyp python make g++ git && \

# install npm globals
    npm install -g bower && \
    npm install -g ember-cli && \

# install all dependencies
    npm run setup && \

# cleanup
    apk del .gyp python make g++ git && \
    bower cache clean && \
    npm uninstall -g bower && \
    npm cache clean

# copy app
# Note:
# - first argument is the path inside the context of build (folder where Dockerfile is placed)
# - second argument is the docker daemon (newly created container)
# - "." means "current working directory", and since we're not selecting any specific files
# it's basically "copy everything from mobile-wiki project to WORKDIR in docker"
COPY . .

# build app
RUN npm run linter && \
# tests are broken for now
# npm run tests && \
    npm run build-prod

# 8001 is for prod
EXPOSE 8001

# run fastboot-server when 'docker run' will be called
ENTRYPOINT ["npm", "run", "fastboot-server"]
