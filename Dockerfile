FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive TZ=Asia/Shanghai

# 安装 Node.js 和 npm
RUN apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

# 安装Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

# 安装 nginx
RUN apt-get install nginx -y