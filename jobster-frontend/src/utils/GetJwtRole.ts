import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  roles: [string];
}

export const getRoleFromJwt = (): string | null => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return null;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.roles[0];
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};