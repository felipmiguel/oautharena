export class AuthenticationOptions {
  name?: string;
  authority: string;
  appId: string;
  secret?: string;
  targetApi?: string;
  targetAsResource?: boolean;
  scopes?: string;
}
