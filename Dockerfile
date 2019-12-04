FROM mcr.microsoft.com/dotnet/core/sdk:3.0.101-disco-arm64v8 AS build
COPY . .

RUN git submodule update --init src/Dirichlet src/rocksdb-sharp
COPY libsecp256k1.so src/Nethermind/Nethermind.Secp256k1/runtimes/linux-x64/native/libsecp256k1.so
RUN dotnet publish src/Nethermind/Nethermind.Runner -c release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0.1-disco-arm64v8
RUN apt-get update && apt-get -y install libsnappy-dev libc6-dev libc6 unzip
WORKDIR /nethermind
COPY --from=build /out .

ENV ASPNETCORE_ENVIRONMENT docker
ENV NETHERMIND_CONFIG mainnet
ENV NETHERMIND_DETACHED_MODE true

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT

ENTRYPOINT dotnet Nethermind.Runner.dll