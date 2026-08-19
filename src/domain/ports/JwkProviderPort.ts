export interface Jwk {
    kty: string;
    n: string;
    e: string;
    kid: string;
    use: string;
    alg: string;
}

export interface JwkProviderPort {
    getJwkSet(): Promise<{ keys: Jwk[] }>;
}