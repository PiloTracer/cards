"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Company, User, Role } from "@/types/backend";

interface FormState {
  email: string;
  role: Role;
  company_id: string;           // "" for none
  card_full_name: string;
  card_email: string;
  card_mobile_phone: string;
  card_job_title: string;
  card_office_phone: string;
  card_web: string;
}

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ requires unwrapping the promise
  const { id } = React.use(params);

  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  // Fetch companies for the dropdown
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: () => api.get<Company[]>("/companies").then((r) => r.data),
  });

  // Fetch the existing user
  const { data: existing, isLoading } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => api.get<User>(`/users/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });

  // Local form state
  const [form, setForm] = useState<FormState>({
    email: "",
    role: "standard",
    company_id: "",
    card_full_name: "",
    card_email: "",
    card_mobile_phone: "",
    card_job_title: "",
    card_office_phone: "",
    card_web: "",
  });

  // Seed form when we get the user
  useEffect(() => {
    if (!existing) return;
    setForm({
      email: existing.email,
      role: existing.role,
      company_id: existing.company_id ?? "",
      card_full_name: existing.card_full_name ?? "",
      card_email: existing.card_email ?? "",
      card_mobile_phone: existing.card_mobile_phone ?? "",
      card_job_title: existing.card_job_title ?? "",
      card_office_phone: existing.card_office_phone ?? "",
      card_web: existing.card_web ?? "",
    });
  }, [existing]);

  // Mutation to PATCH only changed fields
  const mutation = useMutation({
    mutationFn: async (payload: Partial<FormState>) => {
      // Convert empty string → null for company_id
      if ("company_id" in payload && payload.company_id === "") {
        payload.company_id = null as any;
      }
      const { data } = await api.patch<User>(`/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      router.push("/users");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!existing) return;

    // ❶ Build a payload only with the fields that actually changed:
    const payload: Partial<FormState> = {};

    if (form.email !== existing.email) {
      payload.email = form.email;
    }
    if (form.role !== existing.role) {
      payload.role = form.role;
    }
    // existing.company_id may be null
    if (form.company_id !== (existing.company_id ?? "")) {
      payload.company_id = form.company_id;
    }
    if (form.card_full_name !== (existing.card_full_name ?? "")) {
      payload.card_full_name = form.card_full_name;
    }
    if (form.card_email !== (existing.card_email ?? "")) {
      payload.card_email = form.card_email;
    }
    if (form.card_mobile_phone !== (existing.card_mobile_phone ?? "")) {
      payload.card_mobile_phone = form.card_mobile_phone;
    }
    if (form.card_job_title !== (existing.card_job_title ?? "")) {
      payload.card_job_title = form.card_job_title;
    }
    if (form.card_office_phone !== (existing.card_office_phone ?? "")) {
      payload.card_office_phone = form.card_office_phone;
    }
    if (form.card_web !== (existing.card_web ?? "")) {
      payload.card_web = form.card_web;
    }

    // ❷ Kick off the mutation
    mutation.mutate(payload);
  };

  if (isLoading) {
    return <div>Loading…</div>;
  }

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input"
            >
              {(
                ["owner", "administrator", "collaborator", "standard"] as Role[]
              ).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="company_id">Company</Label>
            <select
              id="company_id"
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">— none —</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="card_full_name">Card Full Name</Label>
            <Input
              id="card_full_name"
              name="card_full_name"
              value={form.card_full_name}
              onChange={handleChange}
            />
          </div>
          {/* repeat the same pattern for card_email, card_mobile_phone, etc. */}
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            variant="default"
            size="md"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Saving…" : "Save Changes"}
          </Button>
          <Button variant="link" size="md" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
