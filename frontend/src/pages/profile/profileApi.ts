import type { CurrentUser } from "../../Auth/Authentication";

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await fetch(
    "http://localhost:8080/api/auth/me",
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Could not load current user");
  }

  return response.json();
}

export async function updateProfile(
  data: Pick<
    CurrentUser,
    "firstName" | "lastName" | "phoneNumber" | "address"
  >
): Promise<CurrentUser> {
  const response = await fetch(
    "http://localhost:8080/api/auth/profile",
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
    throw new Error("Could not update profile");
  }

  return response.json();
}
  