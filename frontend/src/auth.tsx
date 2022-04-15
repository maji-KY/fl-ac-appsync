import { Auth0Client } from "@auth0/auth0-spa-js";
import { FallbackProps } from "react-error-boundary";
import { useRouter } from "next/router";

const auth0Client = new Auth0Client({
  domain: "l0v0l.auth0.com",
  client_id: "SghRucPkj2N1RhEaQcOqlX7vU4ZuPRc5",
  redirect_uri: "http://localhost:8080",
});

const authorizeOptions = {
  audience: "test",
  scope: "openid email profile",
};

export class Auth {
  constructor(private idToken?: string) {}

  async login() {
    await auth0Client.loginWithPopup(authorizeOptions);
    const token = await auth0Client.getTokenSilently(authorizeOptions);
    this.idToken = token;
    console.log(token);
    console.log(JSON.parse(Buffer.from(token.split(".")[1]!, "base64").toString()));
  }

  get token() {
    return this.idToken;
  }
}

export const auth = new Auth();

export class NotAuthenticatedError extends Error {
  constructor() {
    super();
    this.message = "Not Authenticated";
  }
}

export function NotAuthenticatedErrorBoundary({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter();
  if (error instanceof NotAuthenticatedError) {
    if (!auth.token) {
      router.replace("/").then(() => resetErrorBoundary());
    }
  } else {
    throw error;
  }
  return (
    <div>
      <h2>認証されていません</h2>
      <pre>{error.message}</pre>
    </div>
  );
}
