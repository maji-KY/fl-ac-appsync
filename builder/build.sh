cargo build --release

function createZip() {
    cp "target/release/$1" bootstrap
    zip -j "$1.zip" bootstrap
    mv "$1.zip" /artifact/
}

createZip auction
createZip auctions
createZip create_auction
createZip bid
