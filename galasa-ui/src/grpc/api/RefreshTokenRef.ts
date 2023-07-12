// Original file: /Users/em/projects/galasa/webui/galasa-ui/src/proto/dex.proto

import type { Long } from '@grpc/proto-loader';

export interface RefreshTokenRef {
  'id'?: (string);
  'clientId'?: (string);
  'createdAt'?: (number | string | Long);
  'lastUsed'?: (number | string | Long);
}

export interface RefreshTokenRef__Output {
  'id'?: (string);
  'clientId'?: (string);
  'createdAt'?: (Long);
  'lastUsed'?: (Long);
}
