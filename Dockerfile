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
RUN npm run clean-deep

# install prod dependencies
# todo // related to prod build and mobile-wiki's package.json:
# todo // due to difficulties with running mobile-wiki on kubernetes it's impossible to figure out
# todo // the final list of prod dependencies thus it still might be necessary to move some "devDeps" to "deps" section
RUN npm run setup-prod

# store prod dependencies separately for docker's caching reasons
RUN mkdir prod_dependencies
RUN cp -R node_modules prod_dependencies
RUN cp -R bower_components prod_dependencies

# install all dependencies
RUN npm run setup

# copy app
# Note:
# - first argument is the path inside the context of build (folder where Dockerfile is placed)
# - second argument is the docker daemon (newly created container)
# - "." means "current working directory", and since we're not selecting any specific files
# it's basically "copy everything from mobile-wiki project to WORKDIR in docker"
COPY . .

# build app
RUN npm run build
#RUN npm run build-prod #TODO: this should be on prod


FROM node:6.11.3-alpine as build

WORKDIR /app

# copy all required files
COPY --from=prepare_build /app/dist dist
COPY --from=prepare_build /app/fastboot-server fastboot-server
COPY --from=prepare_build /app/config config
COPY --from=prepare_build /app/lib lib
COPY --from=prepare_build /app/package.json /app/bower.json ./

# copy cached prod dependencies
COPY --from=prepare_build /app/prod_dependencies/node_modules node_modules
COPY --from=prepare_build /app/prod_dependencies/bower_components bower_components

# 7001 is for debugging, 8001 is for prod
EXPOSE 7001
EXPOSE 8001

# run fastboot-server when 'docker run' will be called
ENTRYPOINT ["npm", "run", "fastboot-server"]
