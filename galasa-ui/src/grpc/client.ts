/*
 * Copyright contributors to the Galasa project
 */
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { ProtoGrpcType } from '@/generated/grpc/dex';

const PROTO_PATH = './src/grpc/dex.proto';

const packageDefinition = loadSync(PROTO_PATH);
const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export const client = new proto.api.Dex('127.0.0.1:5557', credentials.createInsecure());
