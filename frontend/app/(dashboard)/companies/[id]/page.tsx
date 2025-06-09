"use client";

import React, {
  useState,
  useEffect,
  FormEvent,
} from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Company } from "@/types/backend";

// We keep *only* string fields here, no nulls
type FormState = {
  name: string;
  phone_prefix: string;
  email: string;
  phone: string;
  web: string;
  note: string;
  description: string;
};

export default function EditCompanyPage({
  params,
}: {
  // Next 15 makes params a Promise
  params: Promise<{ id: string }>;
}) {
  // unwrap the promise
  const { id } = React.use(params);

  const { user } = useAuth(); // ensure logged-in
  const router = useRouter();
  const qc = useQueryClient();

  // 1️⃣ Fetch the company
  const {
    data: company,
    isLoading,
    isError,
  } = useQuery<Company>({
    queryKey: ["company", id],
    queryFn: async () => {
      const { data } = await api.get<Company>(`/companies/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });

  // 2️⃣ Local form state: always strings
  const [form, setForm] = useState<FormState>({
    name: "",
    phone_prefix: "",
    email: "",
    phone: "",
    web: "",
    note: "",
    description: "",
  });

  // 3️⃣ When the company arrives, seed the form
  useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name,
      phone_prefix: company.phone_prefix ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      web: company.web ?? "",
      note: company.note ?? "",
      description: company.description ?? "",
    });
  }, [company]);

  // 4️⃣ Build the PATCH mutation
  const mutation = useMutation({
    mutationFn: async (updates: Partial<FormState>) => {
      const { data } = await api.patch<Company>(
        `/companies/${id}`,
        updates
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
      router.push("/companies");
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
    if (!company) return;

    // only send fields that actually changed
    const toSend: Partial<FormState> = {};
    (Object.keys(form) as Array<keyof FormState>).forEach((key) => {
      if (form[key] !== (company as any)[key]) {
        toSend[key] = form[key];
      }
    });

    mutation.mutate(toSend);
  };

  if (isLoading) return <div>Loading…</div>;
  if (isError || !company) return <div>Failed to load company.</div>;

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Company</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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

          <div>
            <Label htmlFor="phone_prefix">Phone Prefix</Label>
            <Input
              id="phone_prefix"
              name="phone_prefix"
              value={form.phone_prefix}
              onChange={handleChange}
            />
          </div>

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

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="web">Website</Label>
            <Input
              id="web"
              name="web"
              value={form.web}
              onChange={handleChange}
            />
          </div>

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
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
