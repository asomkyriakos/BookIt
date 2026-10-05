export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role?: string | null;
  status:string;
}

const API_BASE_URL = "http://localhost:8080";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/auth/showUsers`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
