export interface Login {
  user: object;
  accesstoken: string;
  refreshToken: string;
}

export interface RefreshToken {
  accessToken: string;
}

export interface initiatePasswordReset {
  email: string;
  sessionId: string;
  otpValidated: boolean;
}
export interface CreateUser {
  email: string;
  password: string;
}
