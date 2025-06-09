"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Company } from "@/types/backend";

interface FormState {
  name: string;
  phone_prefix: string;
  email: string;
  phone: string;
  web: string;
  note: string;
  description: string;
}

export default function NewCompanyPage() {
  const { user } = useAuth();       // ensure we’re logged in
  const router = useRouter();
  const qc = useQueryClient();

  // local form state
  const [form, setForm] = useState<FormState>({
    name: "",
    phone_prefix: "",
    email: "",
    phone: "",
    web: "",
    note: "",
    description: "",
  });

  // mutation to POST /companies
  const createCompany = useMutation({
    mutationFn: async (body: FormState) => {
      // strip empty strings → undefined
      const payload: Partial<Company> = {
        name: body.name.trim(),
        phone_prefix: body.phone_prefix || undefined,
        email: body.email || undefined,
        phone: body.phone || undefined,
        web: body.web || undefined,
        note: body.note || undefined,
        description: body.description || undefined,
      };
      const { data } = await api.post<Company>("/companies", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      router.push("/dashboard/companies");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createCompany.mutate(form);
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>New Company</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Name (required) */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone prefix */}
          <div>
            <Label htmlFor="phone_prefix">Phone Prefix</Label>
            <Input
              id="phone_prefix"
              name="phone_prefix"
              value={form.phone_prefix}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Web */}
          <div>
            <Label htmlFor="web">Website</Label>
            <Input
              id="web"
              name="web"
              value={form.web}
              onChange={handleChange}
            />
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              name="note"
              rows={3}
              value={form.note}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            variant="default"
            size="md"
            disabled={createCompany.status === "pending"}
          >
            {createCompany.status === "pending"
              ? "Creating…"
              : "Create Company"}
          </Button>
          <Button variant="link" size="md" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
