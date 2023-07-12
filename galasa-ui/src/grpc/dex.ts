import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { DexClient as _api_DexClient, DexDefinition as _api_DexDefinition } from './api/Dex';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  api: {
    Client: MessageTypeDefinition
    CreateClientReq: MessageTypeDefinition
    CreateClientResp: MessageTypeDefinition
    CreatePasswordReq: MessageTypeDefinition
    CreatePasswordResp: MessageTypeDefinition
    DeleteClientReq: MessageTypeDefinition
    DeleteClientResp: MessageTypeDefinition
    DeletePasswordReq: MessageTypeDefinition
    DeletePasswordResp: MessageTypeDefinition
    Dex: SubtypeConstructor<typeof grpc.Client, _api_DexClient> & { service: _api_DexDefinition }
    ListPasswordReq: MessageTypeDefinition
    ListPasswordResp: MessageTypeDefinition
    ListRefreshReq: MessageTypeDefinition
    ListRefreshResp: MessageTypeDefinition
    Password: MessageTypeDefinition
    RefreshTokenRef: MessageTypeDefinition
    RevokeRefreshReq: MessageTypeDefinition
    RevokeRefreshResp: MessageTypeDefinition
    UpdateClientReq: MessageTypeDefinition
    UpdateClientResp: MessageTypeDefinition
    UpdatePasswordReq: MessageTypeDefinition
    UpdatePasswordResp: MessageTypeDefinition
    VerifyPasswordReq: MessageTypeDefinition
    VerifyPasswordResp: MessageTypeDefinition
    VersionReq: MessageTypeDefinition
    VersionResp: MessageTypeDefinition
  }
}

