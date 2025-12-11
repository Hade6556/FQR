"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser, createUserSession, deleteUserSession } from "@/lib/auth";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  // Check if user exists
  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    return { error: "Vartotojas su šiuo el. paštu jau egzistuoja" };
  }

  // Create user
  const user = db.createUser({
    email,
    password, // In production, hash this!
    full_name: fullName,
    gcal_connected: false,
  });

  // Create session
  await createUserSession(user.id);

  revalidatePath("/");
  redirect("/");
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = db.getUserByEmail(email);

  if (!user || user.password !== password) {
    return { error: "Neteisingas el. paštas arba slaptažodis" };
  }

  await createUserSession(user.id);

  revalidatePath("/");
  redirect("/");
}

export async function signOut() {
  await deleteUserSession();
  revalidatePath("/");
  redirect("/login");
}

export async function getUser() {
  return getCurrentUser();
}
