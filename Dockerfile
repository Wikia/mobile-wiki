FROM node:6.10

# phantomjs workaround
RUN echo -e '#!/bin/sh\necho "2.1.1"' > /bin/phantomjs
RUN chmod a+x /bin/phantomjs

# bower workaround
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# create release user so that we can chown output dir
RUN useradd -u 663 release

# install i18n-tools
RUN apt-get update && apt-get install -y python python-pip
RUN pip install pyparsing && pip install -i https://pypi.wikia-services.com/simple/ wikia.crowdin

# prepare build dir
RUN mkdir -p /build
COPY package.json /build
COPY . /build
WORKDIR /build

# install dependencies
RUN npm run setup-for-local
