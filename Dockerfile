FROM mcr.microsoft.com/dotnet/core/sdk:3.0-stretch-arm64v8 AS build
RUN git clone https://github.com/NethermindEth/nethermind.git nethermind/
RUN cd nethermind/ && git submodule update --init src/Dirichlet src/rocksdb-sharp
RUN cd nethermind/ && dotnet publish src/Nethermind/Nethermind.Runner -c release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-stretch-arm64v8
RUN apt-get update && apt-get -y install libsnappy-dev libc6-dev libc6 libzstd1 libgflags-dev libssl1.0.0
WORKDIR /nethermind
COPY --from=build /nethermind/out .

ENV DOTNET_RUNTIME_ID debian-arm64
ENV ASPNETCORE_ENVIRONMENT docker
ENV NETHERMIND_CONFIG mainnet
ENV NETHERMIND_DETACHED_MODE true

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT

RUN ln -s /lib/aarch64-linux-gnu/libzstd.so.1 /lib/aarch64-linux-gnu/libzstd.so.0
RUN ln -s /lib/aarch64-linux-gnu/libgflags.so /lib/aarch64-linux-gnu/libgflags.so.2

COPY arm/lib/librocksdb.so /nethermind/librocksdb.so
COPY arm/lib/libsecp256k1.so /nethermind/runtimes/linux-x64/native/libsecp256k1.so

ENTRYPOINT ["dotnet", "Nethermind.Runner.dll"]