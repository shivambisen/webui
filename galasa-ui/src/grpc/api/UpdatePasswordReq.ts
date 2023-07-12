// Original file: /Users/em/projects/galasa/webui/galasa-ui/src/proto/dex.proto


export interface UpdatePasswordReq {
  'email'?: (string);
  'newHash'?: (Buffer | Uint8Array | string);
  'newUsername'?: (string);
}

export interface UpdatePasswordReq__Output {
  'email'?: (string);
  'newHash'?: (Buffer);
  'newUsername'?: (string);
}
