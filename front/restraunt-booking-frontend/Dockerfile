FROM node:18

RUN corepack enable && corepack prepare yarn@4.2.2 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]