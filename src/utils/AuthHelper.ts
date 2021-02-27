type JWK = {
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
  x5t: string;
  x5c: string[];
};

type JWKS = {
  keys: JWK[];
};

function decodeAndParseJson<T>(base64: string): T {
  const json = new Buffer(base64, "base64").toString("ascii");
  return JSON.parse(json);
}

export {
  decodeAndParseJson,
  JWK,
  JWKS
};
