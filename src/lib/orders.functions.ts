import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  whatsapp: z.string().trim().max(30).default(""),
  email: z.string().trim().max(160).default(""),
  address: z.string().trim().min(5).max(400),
  city: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(600).default(""),
  items: z
    .array(z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(1).max(99) }))
    .min(1)
    .max(50),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ids = data.items.map((i) => i.product_id);
    const { data: products, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, sale_price, in_stock")
      .in("id", ids);

    if (productError || !products?.length) throw new Error("Products could not be loaded.");

    const lines = data.items
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product || !product.in_stock) return null;
        const unit = Number(product.sale_price ?? product.price);
        return {
          product_id: product.id,
          product_name: product.name,
          unit_price: unit,
          quantity: item.quantity,
        };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);

    if (!lines.length) throw new Error("None of the selected products are available.");

    const { data: settings } = await supabaseAdmin.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    for (const row of settings ?? []) map[row.key] = row.value;

    const subtotal = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);
    const baseFee = Number(map["delivery_fee"] ?? 250);
    const freeOver = Number(map["free_delivery_over"] ?? 0);
    const deliveryFee = freeOver > 0 && subtotal >= freeOver ? 0 : baseFee;
    const total = subtotal + deliveryFee;

    const orderNumber = `MI-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(
      Math.random() * 900 + 100,
    )}`;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customer_name,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        address: data.address,
        city: data.city,
        notes: data.notes,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: "cod",
        status: "new",
      })
      .select("id, order_number, total")
      .single();

    if (error || !order) throw new Error("Order could not be saved. Please try again.");

    await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));

    return {
      order_number: order.order_number,
      total: Number(order.total),
      subtotal,
      delivery_fee: deliveryFee,
    };
  });
