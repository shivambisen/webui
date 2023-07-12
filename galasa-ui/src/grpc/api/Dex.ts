// Original file: /Users/em/projects/galasa/webui/galasa-ui/src/proto/dex.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type { CreateClientReq as _api_CreateClientReq, CreateClientReq__Output as _api_CreateClientReq__Output } from './CreateClientReq';
import type { CreateClientResp as _api_CreateClientResp, CreateClientResp__Output as _api_CreateClientResp__Output } from './CreateClientResp';
import type { CreatePasswordReq as _api_CreatePasswordReq, CreatePasswordReq__Output as _api_CreatePasswordReq__Output } from './CreatePasswordReq';
import type {
  CreatePasswordResp as _api_CreatePasswordResp,
  CreatePasswordResp__Output as _api_CreatePasswordResp__Output,
} from './CreatePasswordResp';
import type { DeleteClientReq as _api_DeleteClientReq, DeleteClientReq__Output as _api_DeleteClientReq__Output } from './DeleteClientReq';
import type { DeleteClientResp as _api_DeleteClientResp, DeleteClientResp__Output as _api_DeleteClientResp__Output } from './DeleteClientResp';
import type { DeletePasswordReq as _api_DeletePasswordReq, DeletePasswordReq__Output as _api_DeletePasswordReq__Output } from './DeletePasswordReq';
import type {
  DeletePasswordResp as _api_DeletePasswordResp,
  DeletePasswordResp__Output as _api_DeletePasswordResp__Output,
} from './DeletePasswordResp';
import type { ListPasswordReq as _api_ListPasswordReq, ListPasswordReq__Output as _api_ListPasswordReq__Output } from './ListPasswordReq';
import type { ListPasswordResp as _api_ListPasswordResp, ListPasswordResp__Output as _api_ListPasswordResp__Output } from './ListPasswordResp';
import type { ListRefreshReq as _api_ListRefreshReq, ListRefreshReq__Output as _api_ListRefreshReq__Output } from './ListRefreshReq';
import type { ListRefreshResp as _api_ListRefreshResp, ListRefreshResp__Output as _api_ListRefreshResp__Output } from './ListRefreshResp';
import type { RevokeRefreshReq as _api_RevokeRefreshReq, RevokeRefreshReq__Output as _api_RevokeRefreshReq__Output } from './RevokeRefreshReq';
import type { RevokeRefreshResp as _api_RevokeRefreshResp, RevokeRefreshResp__Output as _api_RevokeRefreshResp__Output } from './RevokeRefreshResp';
import type { UpdateClientReq as _api_UpdateClientReq, UpdateClientReq__Output as _api_UpdateClientReq__Output } from './UpdateClientReq';
import type { UpdateClientResp as _api_UpdateClientResp, UpdateClientResp__Output as _api_UpdateClientResp__Output } from './UpdateClientResp';
import type { UpdatePasswordReq as _api_UpdatePasswordReq, UpdatePasswordReq__Output as _api_UpdatePasswordReq__Output } from './UpdatePasswordReq';
import type {
  UpdatePasswordResp as _api_UpdatePasswordResp,
  UpdatePasswordResp__Output as _api_UpdatePasswordResp__Output,
} from './UpdatePasswordResp';
import type { VerifyPasswordReq as _api_VerifyPasswordReq, VerifyPasswordReq__Output as _api_VerifyPasswordReq__Output } from './VerifyPasswordReq';
import type {
  VerifyPasswordResp as _api_VerifyPasswordResp,
  VerifyPasswordResp__Output as _api_VerifyPasswordResp__Output,
} from './VerifyPasswordResp';
import type { VersionReq as _api_VersionReq, VersionReq__Output as _api_VersionReq__Output } from './VersionReq';
import type { VersionResp as _api_VersionResp, VersionResp__Output as _api_VersionResp__Output } from './VersionResp';

export interface DexClient extends grpc.Client {
  CreateClient(
    argument: _api_CreateClientReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreateClientResp__Output>
  ): grpc.ClientUnaryCall;
  CreateClient(
    argument: _api_CreateClientReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_CreateClientResp__Output>
  ): grpc.ClientUnaryCall;
  CreateClient(
    argument: _api_CreateClientReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreateClientResp__Output>
  ): grpc.ClientUnaryCall;
  CreateClient(argument: _api_CreateClientReq, callback: grpc.requestCallback<_api_CreateClientResp__Output>): grpc.ClientUnaryCall;
  createClient(
    argument: _api_CreateClientReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreateClientResp__Output>
  ): grpc.ClientUnaryCall;
  createClient(
    argument: _api_CreateClientReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_CreateClientResp__Output>
  ): grpc.ClientUnaryCall;
  createClient(
    argument: _api_CreateClientReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreateClientResp__Output>
  ): grpc.ClientUnaryCall;
  createClient(argument: _api_CreateClientReq, callback: grpc.requestCallback<_api_CreateClientResp__Output>): grpc.ClientUnaryCall;

  CreatePassword(
    argument: _api_CreatePasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  CreatePassword(
    argument: _api_CreatePasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_CreatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  CreatePassword(
    argument: _api_CreatePasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  CreatePassword(argument: _api_CreatePasswordReq, callback: grpc.requestCallback<_api_CreatePasswordResp__Output>): grpc.ClientUnaryCall;
  createPassword(
    argument: _api_CreatePasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  createPassword(
    argument: _api_CreatePasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_CreatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  createPassword(
    argument: _api_CreatePasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_CreatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  createPassword(argument: _api_CreatePasswordReq, callback: grpc.requestCallback<_api_CreatePasswordResp__Output>): grpc.ClientUnaryCall;

  DeleteClient(
    argument: _api_DeleteClientReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeleteClientResp__Output>
  ): grpc.ClientUnaryCall;
  DeleteClient(
    argument: _api_DeleteClientReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_DeleteClientResp__Output>
  ): grpc.ClientUnaryCall;
  DeleteClient(
    argument: _api_DeleteClientReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeleteClientResp__Output>
  ): grpc.ClientUnaryCall;
  DeleteClient(argument: _api_DeleteClientReq, callback: grpc.requestCallback<_api_DeleteClientResp__Output>): grpc.ClientUnaryCall;
  deleteClient(
    argument: _api_DeleteClientReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeleteClientResp__Output>
  ): grpc.ClientUnaryCall;
  deleteClient(
    argument: _api_DeleteClientReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_DeleteClientResp__Output>
  ): grpc.ClientUnaryCall;
  deleteClient(
    argument: _api_DeleteClientReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeleteClientResp__Output>
  ): grpc.ClientUnaryCall;
  deleteClient(argument: _api_DeleteClientReq, callback: grpc.requestCallback<_api_DeleteClientResp__Output>): grpc.ClientUnaryCall;

  DeletePassword(
    argument: _api_DeletePasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeletePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  DeletePassword(
    argument: _api_DeletePasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_DeletePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  DeletePassword(
    argument: _api_DeletePasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeletePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  DeletePassword(argument: _api_DeletePasswordReq, callback: grpc.requestCallback<_api_DeletePasswordResp__Output>): grpc.ClientUnaryCall;
  deletePassword(
    argument: _api_DeletePasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeletePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  deletePassword(
    argument: _api_DeletePasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_DeletePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  deletePassword(
    argument: _api_DeletePasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_DeletePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  deletePassword(argument: _api_DeletePasswordReq, callback: grpc.requestCallback<_api_DeletePasswordResp__Output>): grpc.ClientUnaryCall;

  GetVersion(
    argument: _api_VersionReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_VersionResp__Output>
  ): grpc.ClientUnaryCall;
  GetVersion(argument: _api_VersionReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_api_VersionResp__Output>): grpc.ClientUnaryCall;
  GetVersion(argument: _api_VersionReq, options: grpc.CallOptions, callback: grpc.requestCallback<_api_VersionResp__Output>): grpc.ClientUnaryCall;
  GetVersion(argument: _api_VersionReq, callback: grpc.requestCallback<_api_VersionResp__Output>): grpc.ClientUnaryCall;
  getVersion(
    argument: _api_VersionReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_VersionResp__Output>
  ): grpc.ClientUnaryCall;
  getVersion(argument: _api_VersionReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_api_VersionResp__Output>): grpc.ClientUnaryCall;
  getVersion(argument: _api_VersionReq, options: grpc.CallOptions, callback: grpc.requestCallback<_api_VersionResp__Output>): grpc.ClientUnaryCall;
  getVersion(argument: _api_VersionReq, callback: grpc.requestCallback<_api_VersionResp__Output>): grpc.ClientUnaryCall;

  ListPasswords(
    argument: _api_ListPasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  ListPasswords(
    argument: _api_ListPasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_ListPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  ListPasswords(
    argument: _api_ListPasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  ListPasswords(argument: _api_ListPasswordReq, callback: grpc.requestCallback<_api_ListPasswordResp__Output>): grpc.ClientUnaryCall;
  listPasswords(
    argument: _api_ListPasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  listPasswords(
    argument: _api_ListPasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_ListPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  listPasswords(
    argument: _api_ListPasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  listPasswords(argument: _api_ListPasswordReq, callback: grpc.requestCallback<_api_ListPasswordResp__Output>): grpc.ClientUnaryCall;

  ListRefresh(
    argument: _api_ListRefreshReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  ListRefresh(
    argument: _api_ListRefreshReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_ListRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  ListRefresh(
    argument: _api_ListRefreshReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  ListRefresh(argument: _api_ListRefreshReq, callback: grpc.requestCallback<_api_ListRefreshResp__Output>): grpc.ClientUnaryCall;
  listRefresh(
    argument: _api_ListRefreshReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  listRefresh(
    argument: _api_ListRefreshReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_ListRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  listRefresh(
    argument: _api_ListRefreshReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_ListRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  listRefresh(argument: _api_ListRefreshReq, callback: grpc.requestCallback<_api_ListRefreshResp__Output>): grpc.ClientUnaryCall;

  RevokeRefresh(
    argument: _api_RevokeRefreshReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  RevokeRefresh(
    argument: _api_RevokeRefreshReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  RevokeRefresh(
    argument: _api_RevokeRefreshReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  RevokeRefresh(argument: _api_RevokeRefreshReq, callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>): grpc.ClientUnaryCall;
  revokeRefresh(
    argument: _api_RevokeRefreshReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  revokeRefresh(
    argument: _api_RevokeRefreshReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  revokeRefresh(
    argument: _api_RevokeRefreshReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>
  ): grpc.ClientUnaryCall;
  revokeRefresh(argument: _api_RevokeRefreshReq, callback: grpc.requestCallback<_api_RevokeRefreshResp__Output>): grpc.ClientUnaryCall;

  UpdateClient(
    argument: _api_UpdateClientReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdateClientResp__Output>
  ): grpc.ClientUnaryCall;
  UpdateClient(
    argument: _api_UpdateClientReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_UpdateClientResp__Output>
  ): grpc.ClientUnaryCall;
  UpdateClient(
    argument: _api_UpdateClientReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdateClientResp__Output>
  ): grpc.ClientUnaryCall;
  UpdateClient(argument: _api_UpdateClientReq, callback: grpc.requestCallback<_api_UpdateClientResp__Output>): grpc.ClientUnaryCall;
  updateClient(
    argument: _api_UpdateClientReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdateClientResp__Output>
  ): grpc.ClientUnaryCall;
  updateClient(
    argument: _api_UpdateClientReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_UpdateClientResp__Output>
  ): grpc.ClientUnaryCall;
  updateClient(
    argument: _api_UpdateClientReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdateClientResp__Output>
  ): grpc.ClientUnaryCall;
  updateClient(argument: _api_UpdateClientReq, callback: grpc.requestCallback<_api_UpdateClientResp__Output>): grpc.ClientUnaryCall;

  UpdatePassword(
    argument: _api_UpdatePasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  UpdatePassword(
    argument: _api_UpdatePasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  UpdatePassword(
    argument: _api_UpdatePasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  UpdatePassword(argument: _api_UpdatePasswordReq, callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>): grpc.ClientUnaryCall;
  updatePassword(
    argument: _api_UpdatePasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  updatePassword(
    argument: _api_UpdatePasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  updatePassword(
    argument: _api_UpdatePasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>
  ): grpc.ClientUnaryCall;
  updatePassword(argument: _api_UpdatePasswordReq, callback: grpc.requestCallback<_api_UpdatePasswordResp__Output>): grpc.ClientUnaryCall;

  VerifyPassword(
    argument: _api_VerifyPasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  VerifyPassword(
    argument: _api_VerifyPasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  VerifyPassword(
    argument: _api_VerifyPasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  VerifyPassword(argument: _api_VerifyPasswordReq, callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>): grpc.ClientUnaryCall;
  verifyPassword(
    argument: _api_VerifyPasswordReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  verifyPassword(
    argument: _api_VerifyPasswordReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  verifyPassword(
    argument: _api_VerifyPasswordReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>
  ): grpc.ClientUnaryCall;
  verifyPassword(argument: _api_VerifyPasswordReq, callback: grpc.requestCallback<_api_VerifyPasswordResp__Output>): grpc.ClientUnaryCall;
}

export interface DexHandlers extends grpc.UntypedServiceImplementation {
  CreateClient: grpc.handleUnaryCall<_api_CreateClientReq__Output, _api_CreateClientResp>;

  CreatePassword: grpc.handleUnaryCall<_api_CreatePasswordReq__Output, _api_CreatePasswordResp>;

  DeleteClient: grpc.handleUnaryCall<_api_DeleteClientReq__Output, _api_DeleteClientResp>;

  DeletePassword: grpc.handleUnaryCall<_api_DeletePasswordReq__Output, _api_DeletePasswordResp>;

  GetVersion: grpc.handleUnaryCall<_api_VersionReq__Output, _api_VersionResp>;

  ListPasswords: grpc.handleUnaryCall<_api_ListPasswordReq__Output, _api_ListPasswordResp>;

  ListRefresh: grpc.handleUnaryCall<_api_ListRefreshReq__Output, _api_ListRefreshResp>;

  RevokeRefresh: grpc.handleUnaryCall<_api_RevokeRefreshReq__Output, _api_RevokeRefreshResp>;

  UpdateClient: grpc.handleUnaryCall<_api_UpdateClientReq__Output, _api_UpdateClientResp>;

  UpdatePassword: grpc.handleUnaryCall<_api_UpdatePasswordReq__Output, _api_UpdatePasswordResp>;

  VerifyPassword: grpc.handleUnaryCall<_api_VerifyPasswordReq__Output, _api_VerifyPasswordResp>;
}

export interface DexDefinition extends grpc.ServiceDefinition {
  CreateClient: MethodDefinition<_api_CreateClientReq, _api_CreateClientResp, _api_CreateClientReq__Output, _api_CreateClientResp__Output>;
  CreatePassword: MethodDefinition<_api_CreatePasswordReq, _api_CreatePasswordResp, _api_CreatePasswordReq__Output, _api_CreatePasswordResp__Output>;
  DeleteClient: MethodDefinition<_api_DeleteClientReq, _api_DeleteClientResp, _api_DeleteClientReq__Output, _api_DeleteClientResp__Output>;
  DeletePassword: MethodDefinition<_api_DeletePasswordReq, _api_DeletePasswordResp, _api_DeletePasswordReq__Output, _api_DeletePasswordResp__Output>;
  GetVersion: MethodDefinition<_api_VersionReq, _api_VersionResp, _api_VersionReq__Output, _api_VersionResp__Output>;
  ListPasswords: MethodDefinition<_api_ListPasswordReq, _api_ListPasswordResp, _api_ListPasswordReq__Output, _api_ListPasswordResp__Output>;
  ListRefresh: MethodDefinition<_api_ListRefreshReq, _api_ListRefreshResp, _api_ListRefreshReq__Output, _api_ListRefreshResp__Output>;
  RevokeRefresh: MethodDefinition<_api_RevokeRefreshReq, _api_RevokeRefreshResp, _api_RevokeRefreshReq__Output, _api_RevokeRefreshResp__Output>;
  UpdateClient: MethodDefinition<_api_UpdateClientReq, _api_UpdateClientResp, _api_UpdateClientReq__Output, _api_UpdateClientResp__Output>;
  UpdatePassword: MethodDefinition<_api_UpdatePasswordReq, _api_UpdatePasswordResp, _api_UpdatePasswordReq__Output, _api_UpdatePasswordResp__Output>;
  VerifyPassword: MethodDefinition<_api_VerifyPasswordReq, _api_VerifyPasswordResp, _api_VerifyPasswordReq__Output, _api_VerifyPasswordResp__Output>;
}
