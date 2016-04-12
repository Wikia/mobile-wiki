FROM node:0.12

# phantomjs workaround
RUN echo -e '#!/bin/sh\necho "2.1.1"' > /bin/phantomjs
RUN chmod a+x /bin/phantomjs

# bower workaround
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# create release user so that we can chown output dir
RUN useradd -u 663 release

# prepare build dir
RUN mkdir -p /build
COPY package.json /build
COPY . /build
WORKDIR /build

# install dependencies
RUN npm run setup-for-local
