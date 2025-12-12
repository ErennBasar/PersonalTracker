export interface RegisterRequest {
  username: string;
  password: string;
  gender: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Backend'den başarılı giriş/kayıt sonrası dönen User objesi
export interface AuthUser {
  id: string;
  username: string;
  gender: string;
  token?: string; // JWT için
}
