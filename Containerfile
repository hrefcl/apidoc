# Containerfile for apidoc
FROM node:20-alpine

LABEL org.label-schema.name="apidoc" \
    org.label-schema.description="apidoc container image" \
    org.label-schema.url="http://apidoc.app/" \
    org.label-schema.vcs-url="https://github.com/hrefcl/apidoc"

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:$NPM_CONFIG_PREFIX/bin

USER node

RUN mkdir -p /home/node/apidoc

WORKDIR /home/node/apidoc

RUN npm install --omit=dev -g apidoc

ENTRYPOINT ["apidoc"]
