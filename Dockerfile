FROM node:6.11.3 as prepare_build

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

# create folder to cache dependencies
WORKDIR /app
COPY package.json .
COPY bower.json .

# install npm globals
RUN npm install -g bower
RUN npm install -g ember-cli

# install prod dependencies
RUN npm run setup-prod

# store prod dependencies separately for docker's caching reasons
RUN mkdir prod_dependencies
RUN cp -R node_modules prod_dependencies
RUN cp -R bower_components prod_dependencies

# install all dependencies
RUN npm run setup

# copy app
COPY . .

# build app
RUN npm run build-prod


FROM node:6.11.3-alpine as build

WORKDIR /app

# copy app
COPY --from=prepare_build /app/dist .

# copy cached prod dependencies
COPY --from=prepare_build /app/prod_dependencies/node_modules node_modules
COPY --from=prepare_build /app/prod_dependencies/bower_components bower_components

# 7001 is for debugging, 8001 is for prod
EXPOSE 7001
EXPOSE 8001

# run fastboot-server when 'docker run' will be called
ENTRYPOINT ["npm", "run", "fastboot-server"]
