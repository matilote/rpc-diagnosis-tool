FROM mcr.microsoft.com/dotnet/core/sdk:3.0.101-disco-arm64v8 AS build
#RUN apt-get update && apt-get -y git
RUN git clone --recursive https://github.com/NethermindEth/nethermind

#RUN git submodule update --init src/Dirichlet src/rocksdb-sharp
RUN dotnet publish src/Nethermind/Nethermind.Runner -c release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0.1-disco-arm64v8
RUN apt-get update && apt-get -y install libsnappy-dev libc6-dev libc6 libzstd1 libgflags-dev
WORKDIR /nethermind
COPY --from=build /out .

ENV ASPNETCORE_ENVIRONMENT docker
ENV NETHERMIND_CONFIG mainnet
ENV NETHERMIND_DETACHED_MODE true

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT

COPY librocksdb.so /nethermind/librocksdb.so
COPY libsecp256k1.so /nethermind/runtimes/linux-x64/native/libsecp256k1.so

ENTRYPOINT dotnet Nethermind.Runner.dll