import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CITIES } from "@/lib/site";

type Field =
  | "business_name"
  | "business_type"
  | "city"
  | "area"
  | "experience"
  | "quantity";

export type InquiryFormProps = {
  type: "reseller" | "wholesale" | "distributor" | "contact";
  fields?: Field[];
  submitLabel?: string;
};

const LABELS: Record<Field, string> = {
  business_name: "Business / Shop name",
  business_type: "Business type (retail, online, pharmacy…)",
  city: "City",
  area: "Area / Territory of interest",
  experience: "Relevant experience",
  quantity: "Expected monthly quantity",
};

export function InquiryForm({ type, fields = [], submitLabel = "Send Inquiry" }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      type,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      whatsapp: String(data.get("whatsapp") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      business_name: String(data.get("business_name") ?? "").trim(),
      business_type: String(data.get("business_type") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      area: String(data.get("area") ?? "").trim(),
      experience: String(data.get("experience") ?? "").trim(),
      quantity: String(data.get("quantity") ?? "").trim(),
    };

    if (payload.name.length < 2 || payload.phone.length < 7) {
      toast.error("Please add your name and a valid phone number.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("inquiries").insert(payload);
    setLoading(false);

    if (error) {
      toast.error("We couldn't send your inquiry. Please try WhatsApp instead.");
      return;
    }
    toast.success("Thank you! Our team will contact you shortly.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor={`${type}-name`}>Full name *</Label>
        <Input id={`${type}-name`} name="name" required placeholder="Your name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${type}-phone`}>Phone *</Label>
        <Input id={`${type}-phone`} name="phone" required placeholder="03xx xxxxxxx" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${type}-whatsapp`}>WhatsApp number</Label>
        <Input id={`${type}-whatsapp`} name="whatsapp" placeholder="03xx xxxxxxx" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${type}-email`}>Email</Label>
        <Input id={`${type}-email`} name="email" type="email" placeholder="you@example.com" />
      </div>

      {fields.map((field) => (
        <div key={field} className="grid gap-2">
          <Label htmlFor={`${type}-${field}`}>{LABELS[field]}</Label>
          {field === "city" ? (
            <select
              id={`${type}-${field}`}
              name={field}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <Input id={`${type}-${field}`} name={field} />
          )}
        </div>
      ))}

      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor={`${type}-message`}>Message</Label>
        <Textarea id={`${type}-message`} name="message" rows={4} placeholder="Tell us how we can help…" />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
