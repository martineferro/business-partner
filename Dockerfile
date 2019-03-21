FROM node:8-alpine
MAINTAINER lasong

WORKDIR /home/node/business-partner

RUN chown -Rf node:node .

ENV NODE_ENV=development

# Bundle app source by overwriting all WORKDIR content.
COPY --chown=node:node . .

RUN apk add --no-cache curl

USER node

RUN npm install && npm cache clean --force

# A container must expose a port if it wants to be registered in Consul by Registrator.
# The port is fed both to node express server and Consul => DRY principle is observed with ENV VAR.
# NOTE: a port can be any, not necessarily different from exposed ports of other containers.
EXPOSE 3046

HEALTHCHECK --interval=15s --timeout=3s --retries=12 \
  CMD curl --silent --fail http://localhost:3046/api/health/check || exit 1

CMD [ "npm", "start"]
