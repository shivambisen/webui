// Original file: /Users/em/projects/galasa/webui/galasa-ui/src/proto/dex.proto


export interface Password {
  'email'?: (string);
  'hash'?: (Buffer | Uint8Array | string);
  'username'?: (string);
  'userId'?: (string);
}

export interface Password__Output {
  'email'?: (string);
  'hash'?: (Buffer);
  'username'?: (string);
  'userId'?: (string);
}
