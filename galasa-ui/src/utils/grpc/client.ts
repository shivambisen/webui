/*
 * Copyright contributors to the Galasa project
 */
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { ProtoGrpcType } from '@/generated/grpc/dex';

const PROTO_PATH = './src/utils/grpc/dex.proto';

const packageDefinition = loadSync(PROTO_PATH);
const proto = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export const client = new proto.api.Dex(`${process.env.DEX_GRPC_HOSTNAME}`, credentials.createInsecure());
