FROM amazonlinux:2 as builder

WORKDIR /app

ENV PATH="/root/.cargo/bin:$PATH"

# install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --component rustfmt \
    && source $HOME/.cargo/env \
    && cargo init --bin \
    && mkdir /artifact
# pre build dependencies
RUN yum install -y zip gcc
COPY Cargo.lock Cargo.toml builder/build.sh /app/
RUN cargo new --lib rdsdata_mapper_derive
COPY rdsdata_mapper_derive/Cargo.lock rdsdata_mapper_derive/Cargo.toml /app/rdsdata_mapper_derive/
RUN cargo new --lib rdsdata_mapper
COPY rdsdata_mapper/Cargo.lock rdsdata_mapper/Cargo.toml /app/rdsdata_mapper/
RUN rm src/*.rs & rm rdsdata_mapper_derive/src/*.rs & rm rdsdata_mapper/src/*.rs

CMD ["/bin/bash", "/app/build.sh"]
