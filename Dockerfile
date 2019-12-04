FROM mcr.microsoft.com/dotnet/core/sdk:3.0.101-disco-arm64v8 AS build
RUN git clone --recursive https://github.com/NethermindEth/nethermind && \
    cd nethermind && \
    git submodule update --init src/Dirichlet src/rocksdb-sharp && \
    dotnet publish src/Nethermind/Nethermind.Runner -c release -o /out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0.1-disco-arm64v8
RUN apt-get update && apt-get -y install libsnappy-dev libc6-dev libc6 unzip
WORKDIR /nethermind
COPY --from=build /nethermind/out /nethermind

ENV ASPNETCORE_ENVIRONMENT docker
ENV NETHERMIND_CONFIG mainnet
ENV NETHERMIND_DETACHED_MODE true

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT

ENTRYPOINT dotnet Nethermind.Runner.dll

######################################

FROM mcr.microsoft.com/dotnet/core/sdk:3.0.101-disco-arm64v8 AS build
RUN apt-get update && \
    git clone --recursive https://github.com/NethermindEth/nethermind /source && \
    dotnet publish /source/src/Nethermind/Nethermind.Runner --configuration Release --output /out
    
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0.1-disco-arm64v8
COPY entrypoint.sh /entrypoint.sh

ENV ASPNETCORE_ENVIRONMENT docker
ENV NETHERMIND_CONFIG mainnet
ENV NETHERMIND_DETACHED_MODE true

RUN apt-get update && apt-get -y install libsnappy-dev libc6-dev libc6 unzip
COPY --from=build --chown=nethermind:nethermind /out /nethermind

ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 8545 30303 30303/udp