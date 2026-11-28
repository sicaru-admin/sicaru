import { CURE_ME } from "@/lib/kuul-cure-me";
import ProductDetailPage, { generateMetadata as productMetadata } from "../[handle]/page";

// Resolve this handle on every request, including 404s during migration and rollback.
export const dynamic = "force-dynamic";

const params = Promise.resolve({ handle: CURE_ME.legacyHandle });

export function generateMetadata() {
  return productMetadata({ params });
}

export default function CureMePage() {
  return <ProductDetailPage params={params} />;
}
