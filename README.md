# lambda用zipのビルド
```
docker-compose -f builder/docker-compose.yml up --build
```
artifactディレクトリにzipが出来ます。

# インフラ構築
zipビルド後に`terraform`ディレクトリで`terraform apply`します。

# フロントエンド
`frontend`ディレクトリで`yarn dev`で立ち上がります。
