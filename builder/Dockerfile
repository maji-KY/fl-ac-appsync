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

RUN cargo build --release
RUN rm src/*.rs

CMD ["/bin/bash", "/app/build.sh"]
