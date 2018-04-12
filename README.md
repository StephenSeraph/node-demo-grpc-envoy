# node-demo-grpc-envoy

A test for gRPC in Envoy.

# Run containers
```
docker-compose up
```

# Test
```bash
cd client
npm run 1 # for Unary
npm run 3 # for Server Stream
npm run 4 # for Bidi Stream
npm start # test all
```

## Problems

- Server Streaming dosenot work well.

## Relevant Issues

- [#3055](https://github.com/envoyproxy/envoy/issues/3055)
