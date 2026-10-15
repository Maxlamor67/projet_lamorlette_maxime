// Ce que le composant ENVOIE à l'API
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Ce que l'API RENVOIE (le mock renvoie ces champs)
export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  message?: string;   
}