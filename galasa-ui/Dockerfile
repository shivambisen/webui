FROM node:18-alpine

# Never run anything in a docker container as the root user if you can help it.
RUN adduser -D --shell /bin/bash galasa

# Our application sits in the the following folder...
WORKDIR /home/galasa

COPY package*.json ./

# Install the application's dependencies
RUN npm clean-install --omit=dev

# Note: The .dockerignore stops us copying any node_modules which are on the local system.
COPY . .

RUN chown -R galasa .

USER galasa

# Just run the build. Doing it inside the docker image build so we use linux OS to do the build...
# in case it adds linux-specific things in there...
RUN npm run build

EXPOSE 8080
ENV PORT 8080

CMD [ "npm" , "start" ]
