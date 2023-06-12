FROM node:16

# Never run anything in a docker container as the root user if you can help it.
RUN useradd --create-home --shell /bin/bash galasa

# Our application sits in the the following folder...
WORKDIR /home/galasa

COPY package*.json ./

# We use --global serve, so that the serve tool is installed onto the PATH
RUN npm clean-install --omit=dev --force 
RUN npm install --global serve --force

# Note: The .dockerignore stops us copying any node_modules which are on the local system.
COPY . . 

RUN chown -R galasa .

USER galasa

# Just run the build. Doing it inside the docker image build so we use linux OS to do the build...
# in case it adds linux-specific things in there...
RUN npm run build

EXPOSE 8080

CMD [ "serve" , "-s" , "build" , "-p" , "8080" ]
