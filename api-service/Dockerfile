FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["yarn", "dev"]
