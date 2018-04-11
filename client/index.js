'use strict';

const fs = require('fs');
const path = require('path');
const grpc = require('grpc');

const fullFileName = path.resolve('./proto/test_protocol.proto');
const proto = grpc.load(fullFileName, 'proto', { convertFieldsToCamelCase: true });

const toNode  = '0.0.0.0:55555';
const toEnvoy = '0.0.0.0:10000';
const addr = toEnvoy;

const insecureCredentials = grpc.credentials.createInsecure();

function unaryCall1(params) {
  const client = new proto.test_protocol.UnaryCall1(addr, insecureCredentials);
  client.Get1(params, function(err, response) {
    if (err) console.log('UnaryCall1 error:', err);
    console.log('UnaryCall1 response:', response);
  });
};

function unaryCall2(params) {
  const client = new proto.test_protocol.UnaryCall2(addr, insecureCredentials);
  client.Get2(params, function(err, response) {
    if (err) console.log('UnaryCall2 error:', err);
    console.log('UnaryCall2 response:', response);
  });
};

function getStream(params) {
  console.log('send GetStream');
  const client = new proto.test_protocol.GetStream(addr, insecureCredentials);
  const stream = client.GetStream(params, function(err, response) {
    if (err) console.log('GetStream error:', err);
    console.log('GetStream response:', response);
  });
  stream.once('metadata', meta => {});
  stream.once('status', status => {});
  stream.on('error', status => {});
  stream.on('data', data => {
    console.log('GetStream get data', data);
  });
};

function duplexStream(params) {
  const client = new proto.test_protocol.DuplexStream(addr, insecureCredentials);
  const stream = client.GetDuplexStream(params, function(err, response) {
    if (err) console.log('DuplexStream error:', err);
    console.log('DuplexStream response:', response);
  });
  stream.once('metadata', meta => {});
  stream.once('status', status => {});
  stream.on('error', status => {});
  stream.on('data', data => {
    console.log('DuplexStream get data', data);
  });
  setInterval(() => {
    const data = { a: Math.random() };
    console.log('DuplexStream write data', data);
    stream.write(data);
  }, 2000);
};

const k = parseInt(process.argv[2]);
if (k === 1 || NaN) unaryCall1();
if (k === 2 || NaN) unaryCall2();
if (k === 3 || NaN) getStream();
if (k === 4 || NaN) duplexStream();
