FROM node:6.11.3 as prepare

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

RUN npm install -g bower
RUN npm install -g ember-cli
RUN npm run setup
RUN npm run build


FROM node:6.11.3-alpine

COPY --from=prepare /build /build
WORKDIR /build

EXPOSE 7001
EXPOSE 8001


ENTRYPOINT ["npm", "run", "fastboot-server"]
