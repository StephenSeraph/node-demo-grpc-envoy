'use strict';

const fs = require('fs');
const path = require('path');
const grpc = require('grpc');

const fullFileName = path.resolve('./proto/test_protocol.proto');
const proto = grpc.load(fullFileName, 'proto', { convertFieldsToCamelCase: true });
const pic = fs.readFileSync('./a.jpg');

function Get1(call, callback) {
  console.log('Get1 req param', call.request);
  const reply = { a: Math.random(), b: pic };
  console.log('Get1 reply', reply);
  callback(null, reply);
}

function Get2(call, callback) {
  console.log('Get2 req param', call.request);
  const reply = { a: Math.random(), b: pic };
  console.log('Get2 reply', reply);
  callback(null, reply);
}

function GetStream(call) {
  console.log('GetStream req param', call.request);
  const id = setInterval(() => {
    const reply = { a: Math.random(), b: pic };
    console.log('GetStream write param', reply);
    call.write(reply, error => {
      if (error) console.log('GetStream write error', error);
    });
  }, 2000);
  call.on('error', error => {
    console.log('GetStream get error', error);
    clearInterval(id);
  });
}

function GetDuplexStream(call) {
  const id = setInterval(() => {
    const reply = { a: Math.random(), b: pic };
    console.log('GetDuplexStream write param', reply);
    call.write(reply, error => {
      if (error) console.log('GetDuplexStream write error', error);
    });
  }, 2000);
  call.on('data', data => {
    console.log('GetDuplexStream get data', data);
  });
  call.on('end', () => {
    console.log('GetDuplexStream get end');
    clearInterval(id);
    call.end();
  });
}

const server = new grpc.Server();
try {
  server.addService(proto.test_protocol.UnaryCall1.service, {Get1});
  server.addService(proto.test_protocol.UnaryCall2.service, {Get2});
  server.addService(proto.test_protocol.GetStream.service, {GetStream});
  server.addService(proto.test_protocol.DuplexStream.service, {GetDuplexStream});

  const insecureCredentials = grpc.ServerCredentials.createInsecure();
  server.bind(`0.0.0.0:55555`, insecureCredentials);
  server.start();

  console.log(`grpc server is listening 0.0.0.0:55555`);
} catch (error) {
  console.log(error);
}