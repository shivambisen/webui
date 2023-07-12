// Original file: /Users/em/projects/galasa/webui/galasa-ui/src/proto/dex.proto

import type { Client as _api_Client, Client__Output as _api_Client__Output } from './Client';

export interface CreateClientResp {
  alreadyExists?: boolean;
  client?: _api_Client | null;
}

export interface CreateClientResp__Output {
  alreadyExists?: boolean;
  client?: _api_Client__Output;
}
