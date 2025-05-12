# Imagen base oficial de Node 22 slim
FROM node:22-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_PROJECT_ID=4d378fa56130355ea47ae76070a0c491
ENV NEXT_PUBLIC_CONTRACT_ADDRESS=0x8d66a351643C90727C0A397e9eF8695961076032
ENV NEXT_PUBLIC_CONTRACT_ADDRESS_NFT=0xd095BB38f20236A3679bd013C9c1a7cA4a43Ba5c
ENV NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=0x3B22bf17D16B87286Ead98D04f5Db0c3134BD121

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
