FROM node:6.11.3-alpine

WORKDIR /app

COPY docker_temp_container .

# 7001 is for debugging, 8001 is for prod
EXPOSE 7001
EXPOSE 8001

# run fastboot-server when 'docker run' will be called
ENTRYPOINT ["npm", "run", "fastboot-server"]

