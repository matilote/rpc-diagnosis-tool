FROM mcr.microsoft.com/dotnet/core/sdk:3.0.101-alpine3.10 AS build

RUN echo "@testing http://nl.alpinelinux.org/alpine/edge/testing" >>/etc/apk/repositories
RUN apk upgrade && apk add --update --no-cache build-base linux-headers git cmake bash zlib zlib-dev bzip2 bzip2-dev snappy snappy-dev lz4 lz4-dev zstd zstd-dev libtbb-dev@testing libtbb@testing

RUN git clone https://github.com/gflags/gflags.git && \
    cd gflags && \
    mkdir build && \
    cd build && \
    cmake -DBUILD_SHARED_LIBS=1 -DGFLAGS_INSTALL_SHARED_LIBS=1 .. && \
    make install && \
    cd ~ && \
    ls && \
    rm -R gflags/

RUN git clone https://github.com/facebook/rocksdb.git && \
    cd rocksdb && \
    git checkout v6.4.6 && \
    make shared_lib && \
    mkdir -p /usr/local/rocksdb/lib && \
    mkdir /usr/local/rocksdb/include && \
    cp librocksdb.so* /usr/local/rocksdb/lib && \
    cp /usr/local/rocksdb/lib/librocksdb.so* /usr/lib/ && \
    cp -r include /usr/local/rocksdb/ && \
    cp -r include/* /usr/include/ && \
    cd ~ && \
    rm -R rocksdb/
