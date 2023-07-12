// Original file: /Users/em/projects/galasa/webui/galasa-ui/src/proto/dex.proto


export interface Client {
  'id'?: (string);
  'secret'?: (string);
  'redirectUris'?: (string)[];
  'trustedPeers'?: (string)[];
  'public'?: (boolean);
  'name'?: (string);
  'logoUrl'?: (string);
}

export interface Client__Output {
  'id'?: (string);
  'secret'?: (string);
  'redirectUris'?: (string)[];
  'trustedPeers'?: (string)[];
  'public'?: (boolean);
  'name'?: (string);
  'logoUrl'?: (string);
}
