import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPKR } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | Morani International" },
      { name: "description", content: "Staff area for managing Morani International products, orders and inquiries." },
      { property: "og:title", content: "Admin Panel | Morani International" },
      { property: "og:description", content: "Staff only." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

function AdminPage() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s?.user ? { email: s.user.email ?? "" } : null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user ? { email: data.session.user.email ?? "" } : null);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session]);

  if (checking) {
    return <div className="container-page py-24 text-muted-foreground">Loading…</div>;
  }

  if (!session) return <SignIn />;

  if (isAdmin === false) {
    return (
      <div className="container-page py-24">
        <h1 className="text-2xl">No admin access</h1>
        <p className="mt-2 text-muted-foreground">
          This account ({session.email}) is not an administrator.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  if (isAdmin === null) {
    return <div className="container-page py-24 text-muted-foreground">Checking permissions…</div>;
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Signed in as {session.email}</p>
        </div>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="inquiries"><InquiriesTab /></TabsContent>
        <TabsContent value="reviews"><ReviewsTab /></TabsContent>
        <TabsContent value="faqs"><FaqsTab /></TabsContent>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function SignIn() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });
    setLoading(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="container-page flex justify-center py-20">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-soft"
      >
        <h1 className="font-display text-2xl">Admin Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">Staff access only.</p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" name="password" type="password" required />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function useTable(table: string, order: string, ascending = true) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table as never).select("*").order(order, { ascending });
    if (error) toast.error(error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }, [table, order, ascending]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, loading, reload, setRows };
}

async function updateRow(table: string, id: string, patch: Row, reload: () => void) {
  const { error } = await supabase.from(table as never).update(patch as never).eq("id", id);
  if (error) {
    toast.error(error.message);
    return;
  }
  toast.success("Saved");
  reload();
}

const ORDER_STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"];

function OrdersTab() {
  const { rows, loading, reload } = useTable("orders", "created_at", false);
  const [items, setItems] = useState<Record<string, Row[]>>({});

  async function loadItems(orderId: string) {
    if (items[orderId]) return;
    const { data } = await supabase.from("order_items").select("*").eq("order_id", orderId);
    setItems((prev) => ({ ...prev, [orderId]: (data as Row[]) ?? [] }));
  }

  if (loading) return <p className="py-8 text-muted-foreground">Loading orders…</p>;
  if (!rows.length) return <p className="py-8 text-muted-foreground">No orders yet.</p>;

  return (
    <div className="mt-6 space-y-4">
      {rows.map((o) => (
        <details
          key={o.id}
          onToggle={() => loadItems(o.id)}
          className="rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
            <span className="font-display text-lg">{o.order_number}</span>
            <span className="text-sm text-muted-foreground">
              {o.customer_name} — {o.city}
            </span>
            <span className="font-semibold text-primary">{formatPKR(Number(o.total))}</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase">
              {o.status}
            </span>
          </summary>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div className="space-y-1 text-muted-foreground">
              <p>Phone: {o.phone}</p>
              {o.whatsapp && <p>WhatsApp: {o.whatsapp}</p>}
              {o.email && <p>Email: {o.email}</p>}
              <p>Address: {o.address}</p>
              {o.notes && <p>Notes: {o.notes}</p>}
              <p>
                Subtotal {formatPKR(Number(o.subtotal))} + delivery{" "}
                {formatPKR(Number(o.delivery_fee))}
              </p>
            </div>
            <div>
              <ul className="space-y-1 text-muted-foreground">
                {(items[o.id] ?? []).map((it) => (
                  <li key={it.id}>
                    {it.product_name} × {it.quantity} — {formatPKR(Number(it.unit_price))}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <Label htmlFor={`status-${o.id}`} className="text-xs">Status</Label>
                <select
                  id={`status-${o.id}`}
                  defaultValue={o.status}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  onChange={(e) => updateRow("orders", o.id, { status: e.target.value }, reload)}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

function ProductsTab() {
  const { rows, loading, reload } = useTable("products", "sort_order");

  if (loading) return <p className="py-8 text-muted-foreground">Loading products…</p>;

  return (
    <div className="mt-6 space-y-4">
      {rows.map((p) => (
        <details key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
            <span className="font-display text-lg">{p.name}</span>
            <span className="text-sm text-muted-foreground">{formatPKR(Number(p.price))}</span>
            <span className={`text-xs font-semibold uppercase ${p.in_stock ? "text-primary" : "text-destructive"}`}>
              {p.in_stock ? "In stock" : "Out of stock"}
            </span>
          </summary>
          <form
            className="mt-4 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              updateRow(
                "products",
                p.id,
                {
                  name: String(d.get("name")),
                  tagline: String(d.get("tagline")),
                  description: String(d.get("description")),
                  price: Number(d.get("price")),
                  sale_price: d.get("sale_price") ? Number(d.get("sale_price")) : null,
                  net_weight: String(d.get("net_weight")),
                  pack_size: String(d.get("pack_size")),
                  image_url: String(d.get("image_url")),
                  in_stock: d.get("in_stock") === "on",
                  is_featured: d.get("is_featured") === "on",
                  sort_order: Number(d.get("sort_order")),
                },
                reload,
              );
            }}
          >
            <Field name="name" label="Name" defaultValue={p.name} />
            <Field name="tagline" label="Tagline" defaultValue={p.tagline} />
            <Field name="price" label="Price (PKR)" type="number" defaultValue={p.price} />
            <Field name="sale_price" label="Sale price (blank = none)" type="number" defaultValue={p.sale_price ?? ""} />
            <Field name="net_weight" label="Net weight" defaultValue={p.net_weight} />
            <Field name="pack_size" label="Pack size" defaultValue={p.pack_size} />
            <Field name="image_url" label="Image URL" defaultValue={p.image_url} />
            <Field name="sort_order" label="Sort order" type="number" defaultValue={p.sort_order} />
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor={`desc-${p.id}`}>Description</Label>
              <Textarea id={`desc-${p.id}`} name="description" rows={4} defaultValue={p.description} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="in_stock" defaultChecked={p.in_stock} /> In stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_featured" defaultChecked={p.is_featured} /> Featured
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Save product</Button>
            </div>
          </form>
        </details>
      ))}
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={`f-${name}-${label}`}>{label}</Label>
      <Input id={`f-${name}-${label}`} name={name} type={type} defaultValue={defaultValue ?? ""} />
    </div>
  );
}

function InquiriesTab() {
  const { rows, loading, reload } = useTable("inquiries", "created_at", false);
  if (loading) return <p className="py-8 text-muted-foreground">Loading inquiries…</p>;
  if (!rows.length) return <p className="py-8 text-muted-foreground">No inquiries yet.</p>;

  return (
    <div className="mt-6 space-y-4">
      {rows.map((i) => (
        <div key={i.id} className="rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-display text-lg">{i.name}</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase">
              {i.type}
            </span>
          </div>
          <p className="mt-2 text-muted-foreground">
            {[i.phone, i.whatsapp, i.email, i.city].filter(Boolean).join(" • ")}
          </p>
          {i.business_name && <p className="text-muted-foreground">Business: {i.business_name} ({i.business_type})</p>}
          {i.quantity && <p className="text-muted-foreground">Quantity: {i.quantity}</p>}
          {i.area && <p className="text-muted-foreground">Area: {i.area}</p>}
          {i.message && <p className="mt-2">{i.message}</p>}
          <div className="mt-3 flex items-center gap-2">
            <Label htmlFor={`inq-${i.id}`} className="text-xs">Status</Label>
            <select
              id={`inq-${i.id}`}
              defaultValue={i.status}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              onChange={(e) => updateRow("inquiries", i.id, { status: e.target.value }, reload)}
            >
              {["new", "contacted", "converted", "closed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab() {
  const { rows, loading, reload } = useTable("reviews", "sort_order");
  if (loading) return <p className="py-8 text-muted-foreground">Loading reviews…</p>;

  return (
    <div className="mt-6 space-y-4">
      <form
        className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft sm:grid-cols-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const { error: insertError } = await supabase.from("reviews").insert({
            customer_name: String(d.get("customer_name")),
            city: String(d.get("city")),
            rating: Number(d.get("rating")),
            body: String(d.get("body")),
            is_approved: true,
          });
          if (insertError) {
            toast.error(insertError.message);
            return;
          }
          (e.target as HTMLFormElement).reset();
          toast.success("Review added");
          reload();
        }}
      >
        <Input name="customer_name" placeholder="Customer name" required />
        <Input name="city" placeholder="City" />
        <Input name="rating" type="number" min={1} max={5} defaultValue={5} />
        <Input name="body" placeholder="Review text" className="sm:col-span-3" />
        <Button type="submit">Add review</Button>
      </form>

      {rows.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
          <div>
            <p className="font-semibold">{r.customer_name} — {r.rating}★</p>
            <p className="text-muted-foreground">{r.body}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={r.is_approved ? "outline" : "default"}
              onClick={() => updateRow("reviews", r.id, { is_approved: !r.is_approved }, reload)}
            >
              {r.is_approved ? "Unapprove" : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await supabase.from("reviews").delete().eq("id", r.id);
                reload();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqsTab() {
  const { rows, loading, reload } = useTable("faqs", "sort_order");
  if (loading) return <p className="py-8 text-muted-foreground">Loading FAQs…</p>;

  return (
    <div className="mt-6 space-y-4">
      <form
        className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const { error: insertError } = await supabase.from("faqs").insert({
            question: String(d.get("question")),
            answer: String(d.get("answer")),
            group_name: String(d.get("group_name") || "General"),
          });
          if (insertError) {
            toast.error(insertError.message);
            return;
          }
          (e.target as HTMLFormElement).reset();
          toast.success("FAQ added");
          reload();
        }}
      >
        <Input name="question" placeholder="Question" required />
        <Textarea name="answer" placeholder="Answer" rows={3} required />
        <Input name="group_name" placeholder="Group (e.g. Delivery)" />
        <Button type="submit" className="w-fit">Add FAQ</Button>
      </form>

      {rows.map((f) => (
        <div key={f.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
          <div className="max-w-2xl">
            <p className="font-semibold">{f.question}</p>
            <p className="text-muted-foreground">{f.answer}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRow("faqs", f.id, { is_active: !f.is_active }, reload)}
            >
              {f.is_active ? "Hide" : "Show"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await supabase.from("faqs").delete().eq("id", f.id);
                reload();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsTab() {
  const { rows, loading, reload } = useTable("site_settings", "key");
  if (loading) return <p className="py-8 text-muted-foreground">Loading settings…</p>;

  return (
    <form
      className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        for (const row of rows) {
          await supabase
            .from("site_settings")
            .update({ value: String(d.get(row.key) ?? "") })
            .eq("key", row.key);
        }
        toast.success("Settings saved");
        reload();
      }}
    >
      {rows.map((s) => (
        <div key={s.key} className="grid gap-2">
          <Label htmlFor={`set-${s.key}`}>{s.key.replace(/_/g, " ")}</Label>
          <Input id={`set-${s.key}`} name={s.key} defaultValue={s.value} />
        </div>
      ))}
      <div className="sm:col-span-2">
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
