"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Company, User, Role } from "@/types/backend";

interface FormState {
  email: string;
  password: string;
  role: Role;
  company_id: string | "";
  card_full_name: string;
  card_email: string;
  card_mobile_phone: string;
  card_job_title: string;
  card_office_phone: string;
  card_web: string;
}

export default function NewUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  // fetch companies for the "company" dropdown
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await api.get<Company[]>("/companies");
      return data;
    },
  });

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    role: "standard",
    company_id: "",
    card_full_name: "",
    card_email: "",
    card_mobile_phone: "",
    card_job_title: "",
    card_office_phone: "",
    card_web: "",
  });

  const createUser = useMutation({
    mutationFn: async (body: any) => {
      const payload = {
        email: body.email,
        password: body.password,
        role: body.role,
        company_id: body.company_id || null,
        card_full_name: body.card_full_name || undefined,
        card_email: body.card_email || undefined,
        card_mobile_phone: body.card_mobile_phone || undefined,
        card_job_title: body.card_job_title || undefined,
        card_office_phone: body.card_office_phone || undefined,
        card_web: body.card_web || undefined,
      };
      const { data } = await api.post<User>("/users", payload);
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
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createUser.mutate(form);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>New User</CardTitle>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
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
              {(["owner","administrator","collaborator","standard"] as Role[]).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="company_id">Company (optional)</Label>
            <select
              id="company_id"
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">— none —</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
          <div>
            <Label htmlFor="card_email">Card Email</Label>
            <Input
              id="card_email"
              name="card_email"
              type="email"
              value={form.card_email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="card_mobile_phone">Card Mobile Phone</Label>
            <Input
              id="card_mobile_phone"
              name="card_mobile_phone"
              value={form.card_mobile_phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="card_job_title">Card Job Title</Label>
            <Input
              id="card_job_title"
              name="card_job_title"
              value={form.card_job_title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="card_office_phone">Card Office Phone</Label>
            <Input
              id="card_office_phone"
              name="card_office_phone"
              value={form.card_office_phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="card_web">Card Web</Label>
            <Input
              id="card_web"
              name="card_web"
              value={form.card_web}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            variant="default"
            size="md"
            disabled={createUser.status === "pending"}
          >
            {createUser.status === "pending" ? "Creating…" : "Create User"}
          </Button>
          <Button variant="link" size="md" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
