import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
  role?: string;
  exp?: number;
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getUsernameFromJwt = (): string | null => {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decoded = decodeJwt(token);
    return decoded?.sub ?? null;
  }
  return null;
};