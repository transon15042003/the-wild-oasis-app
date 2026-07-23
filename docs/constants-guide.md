# Hướng dẫn quản lý magic string, URL và constants

**Đối tượng:** Dự án React / Next.js (App Router hoặc Pages Router)  
**Mục đích:** Sườn convention có thể copy sang mọi repo — không gắn với một sản phẩm cụ thể  
**Ngôn ngữ:** Tiếng Việt (tên symbol / file giữ tiếng Anh trong code)

---

## 1. Mục tiêu

**Magic string** là chuỗi literal mang ý nghĩa kỹ thuật hoặc nghiệp vụ (path, URL, status, tên bảng, storage key…) bị hardcode rải rác trong UI và data layer.

Constants tập trung giúp:

- Đổi một chỗ → cập nhật mọi nơi
- Giảm typo khi so sánh / gọi API / điều hướng
- Tách rõ **route nội bộ** khỏi **URL / API bên ngoài**
- Review PR có tiêu chí rõ ràng

Tài liệu này là **sườn**: giữ cấu trúc và quy ước; thay ví dụ (`cabins`, `bookings`, `woo:`) bằng tên domain của dự án bạn.

---

## 2. Cấu trúc thư mục `constants/`

Gợi ý vị trí:

| Stack | Đường dẫn gợi ý |
|-------|-----------------|
| Next.js App Router | `app/_lib/constants/` hoặc `src/lib/constants/` |
| Next.js Pages / React SPA | `src/constants/` hoặc `src/lib/constants/` |

Tổ chức **theo loại kỹ thuật**; giá trị nghiệp vụ theo **feature / domain**.

```
constants/
├── index.ts              # Barrel — public API (hoặc index.js)
├── routes.ts             # Route nội bộ (path trong app)
├── api.ts                # URL / endpoint bên ngoài (public, ổn định)
├── tables.ts             # Tên bảng DB (nếu dùng) — hoặc resources.ts
├── <feature>.ts          # Status, filter, enum nghiệp vụ theo feature
├── validation.ts         # Regex, giới hạn độ dài, rule dùng chung
├── storage.ts            # (khi cần) localStorage / sessionStorage keys
└── query-keys.ts         # (khi cần) TanStack Query key factory
```

| File | Trách nhiệm | Ví dụ tên export |
|------|-------------|------------------|
| `routes.ts` | Path điều hướng trong app | `ROUTES` |
| `api.ts` | URL HTTP bên thứ ba, asset URL cố định | `ANALYTICS_URL`, `…_API_URL` |
| `tables.ts` / `resources.ts` | Tên bảng / resource server | `TABLES`, `RESOURCES` |
| `<feature>.ts` | Giá trị domain của feature đó | `ORDER_STATUS`, `PLAN_TIER` |
| `validation.ts` | Pattern / limit dùng lại | `EMAIL_PATTERN`, `…_MAX_LENGTH` |
| `storage.ts` | Chỉ tạo khi dùng Web Storage | `STORAGE_KEYS` |
| `query-keys.ts` | Chỉ tạo khi dùng TanStack Query | `queryKeys` |

**Không** scaffold `storage.ts` / `query-keys.ts` khi feature chưa tồn tại.

**Import:** ưu tiên barrel (điều chỉnh alias theo `tsconfig` / `jsconfig`):

```ts
import { ROUTES, TABLES, ORDER_STATUS } from "@/lib/constants";
// hoặc "@/app/_lib/constants", "@/constants", …
```

---

## 3. Route nội bộ vs URL / API

### 3.1. Không trộn hai loại

| Khái niệm | File | Ví dụ |
|-----------|------|--------|
| **Route** | `routes.ts` | `"/dashboard"`, `"/orders/[id]"` dạng path app |
| **API / URL ngoài** | `api.ts` | `https://api.stripe.com/…`, CDN, logo provider |
| **Env-specific / secret** | `.env` / `.env.local` | `NEXT_PUBLIC_API_BASE_URL`, service role key |

**Sai:** đưa `https://…` vào `ROUTES`.  
**Sai:** hardcode `"/settings"` trong `<Link>` khi đã có `ROUTES.settings`.

### 3.2. Mẫu `routes.ts`

```ts
export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  orders: "/orders",
  order: (id: string | number) => `/orders/${id}`,
  settings: "/settings",
};
```

JavaScript (bỏ type):

```js
export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  orders: "/orders",
  order: (id) => `/orders/${id}`,
  settings: "/settings",
};
```

- Path tĩnh → string  
- Path động → **function**

Dùng với Next.js: `<Link href={ROUTES.order(id)}>`, `redirect(ROUTES.login)`, `router.push(ROUTES.dashboard)`.

### 3.3. `api.ts` vs biến môi trường

| Đưa vào `api.ts` | Đưa vào `.env` |
|------------------|----------------|
| URL public, **không đổi** theo staging/prod | Base URL / key theo môi trường |
| Asset URL cố định (logo OAuth provider, …) | Mọi **secret** (không commit vào constants) |

```ts
// api.ts — URL tĩnh công khai
export const DOCS_CDN_URL = "https://cdn.example.com/docs";
export const OAUTH_GOOGLE_LOGO_URL =
  "https://authjs.dev/img/providers/google.svg";
```

```ts
// Base API theo môi trường — không hardcode trong constants
const base = process.env.NEXT_PUBLIC_API_BASE_URL;
await fetch(`${base}/orders`);
```

Với Create React App / Vite: dùng `import.meta.env.VITE_*` hoặc `process.env.REACT_APP_*` tương ứng — nguyên tắc giống nhau.

---

## 4. Giá trị nghiệp vụ: object map (JS ‖ TS)

### 4.1. Quy ước chung

| Thành phần | Quy ước |
|------------|---------|
| Tên export | `SCREAMING_SNAKE` — `ORDER_STATUS`, `PLAN_TIER` |
| Key trong object | `camelCase` — `inProgress`, `checkedIn` |
| **Value** | **Wire format** — đúng như DB, query string, API (có thể `kebab-case` / `snake_case`) |

> Key phục vụ DX trong code. Value là contract với hệ thống ngoài — **không** đổi value chỉ để “đẹp”.

### 4.2. JavaScript

```js
export const ORDER_STATUS = {
  draft: "draft",
  inProgress: "in-progress",
  completed: "completed",
  cancelled: "cancelled",
};

export const NOTES_MAX_LENGTH = 500;
```

Tùy chọn: `Object.freeze(ORDER_STATUS)`.

### 4.3. TypeScript (khuyến nghị khi dùng TS)

```ts
export const ORDER_STATUS = {
  draft: "draft",
  inProgress: "in-progress",
  completed: "completed",
  cancelled: "cancelled",
} as const;

export type OrderStatus =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
// "draft" | "in-progress" | "completed" | "cancelled"
```

**`enum` TypeScript?** Ưu tiên `as const` + union. Chỉ dùng `enum` nếu team đã chuẩn hóa enum xuyên suốt dự án — tránh mixed style.

```ts
// Không làm mặc định
enum OrderStatus {
  Draft = "draft",
  InProgress = "in-progress",
}
```

### 4.4. Filter / query param

```ts
export const STATUS_FILTER = {
  all: "all",
  active: "active",
  archived: "archived",
} as const;

/** Tên query param trên URL (?status=active) */
export const STATUS_FILTER_PARAM = "status";
```

---

## 5. Tên bảng / resource server

Khi client gọi DB hoặc REST resource bằng string cố định:

```ts
export const TABLES = {
  users: "users",
  orders: "orders",
  products: "products",
};
```

```ts
// Supabase / tương tự
supabase.from(TABLES.orders).select("*");
```

Nếu không dùng SQL table name, đổi tên file/export thành `RESOURCES` / `ENDPOINTS` (path tương đối trên API), vẫn tách khỏi `ROUTES` (path UI).

---

## 6. Phụ lục A — Storage keys

**Tạo `storage.ts` khi** lần đầu đọc/ghi `localStorage` hoặc `sessionStorage`.

### Quy ước

- Object `STORAGE_KEYS`
- Key object: `camelCase`
- Value: **namespace prefix** theo app (tránh collision trên cùng origin)

```ts
// Đổi "myapp" thành short name dự án của bạn
export const STORAGE_KEYS = {
  theme: "myapp:theme",
  sidebarCollapsed: "myapp:sidebarCollapsed",
  lastVisitedId: "myapp:lastVisitedId",
} as const;
```

```js
localStorage.setItem(STORAGE_KEYS.theme, "dark");
```

Không gộp toàn bộ state vào một JSON blob trừ khi cần atomic read/write.

---

## 7. Phụ lục B — Query keys (TanStack Query)

**Tạo `query-keys.ts` khi** thêm TanStack Query (React Query).

### Pattern: factory lồng nhau

Dễ `invalidateQueries` theo prefix.

**TypeScript:**

```ts
export const queryKeys = {
  orders: {
    all: () => ["orders"] as const,
    list: (filters: Record<string, unknown>) =>
      ["orders", "list", filters] as const,
    detail: (id: string | number) =>
      ["orders", "detail", id] as const,
  },
  products: {
    all: () => ["products"] as const,
    detail: (id: string | number) =>
      ["products", "detail", id] as const,
  },
};
```

**JavaScript:**

```js
export const queryKeys = {
  orders: {
    all: () => ["orders"],
    list: (filters) => ["orders", "list", filters],
    detail: (id) => ["orders", "detail", id],
  },
  products: {
    all: () => ["products"],
    detail: (id) => ["products", "detail", id],
  },
};
```

```ts
useQuery({
  queryKey: queryKeys.orders.detail(orderId),
  queryFn: () => getOrder(orderId),
});

queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
```

Export qua barrel khi file được tạo.

---

## 8. Quy ước đặt tên (tóm tắt)

| Thành phần | Quy ước | Ví dụ |
|------------|---------|--------|
| Tên file | `kebab-case` hoặc một từ | `query-keys.ts`, `routes.ts` |
| Export const / object | `SCREAMING_SNAKE` | `ROUTES`, `ORDER_STATUS` |
| Key trong object | `camelCase` | `inProgress`, `editOrder` |
| Value (wire) | Giữ format nguồn thật | `"in-progress"`, `"active"` |
| Route động | function | `order: (id) => \`/orders/${id}\`` |
| Query key factory | nested + functions | `queryKeys.orders.detail(id)` |
| Storage value | prefix namespace | `"myapp:theme"` |
| Import | barrel | `@/lib/constants` (theo alias repo) |

---

## 9. Ngưỡng extract magic string

**Bắt buộc đưa vào `constants/` khi:**

1. Literal thuộc **loại contract** (dù mới dùng 1 lần): route, API/URL ngoài, tên bảng/resource, status, tên/giá trị query param, storage key, query key; **hoặc**
2. Cùng một literal xuất hiện **≥ 2 lần** trong codebase.

**Không bắt buộc:**

- Copy UI một lần (nhãn nút, câu chào không phải wire format)
- Message lỗi chỉ dùng trong một form, không share

---

## 10. Checklist review PR (dùng chung mọi repo)

- [ ] Không hardcode path nội bộ — dùng `ROUTES.*`
- [ ] Không hardcode URL ngoài trong component — dùng `api.ts` hoặc env
- [ ] Không có secret / URL theo môi trường trong `constants/`
- [ ] Status / filter / table (resource) dùng constant
- [ ] Value khớp wire format DB/API (không “camelCase hóa” value nếu wire là kebab/snake)
- [ ] Export mới được re-export qua `index` (barrel)
- [ ] Import từ barrel constants (theo alias dự án)
- [ ] File đúng loại: route → `routes`, API → `api`, domain → `<feature>`
- [ ] PR thêm Web Storage → tạo `storage.ts` + prefix namespace
- [ ] PR thêm TanStack Query → tạo `query-keys.ts` (factory lồng nhau)
- [ ] Không scaffold `storage` / `query-keys` khi chưa có feature
- [ ] Naming: `SCREAMING` export, `camelCase` key

---

## 11. Ví dụ nhanh — trước / sau

**Trước:**

```tsx
<Link href="/orders">Orders</Link>
await supabase.from("orders").eq("status", "in-progress");
```

**Sau:**

```tsx
import { ROUTES, TABLES, ORDER_STATUS } from "@/lib/constants";

<Link href={ROUTES.orders}>Orders</Link>
await supabase.from(TABLES.orders).eq("status", ORDER_STATUS.inProgress);
```

---

## 12. Checklist khởi tạo sườn cho dự án mới

1. Tạo thư mục `constants/` tại vị trí phù hợp stack (mục 2)
2. Thêm `routes.ts`, `api.ts` (nếu có URL ngoài), `index.ts`
3. Thêm `<feature>.ts` khi xuất hiện status/filter đầu tiên
4. Cấu hình path alias → import barrel một dòng
5. Copy checklist mục 10 vào PR template / Contributing (tuỳ chọn)
6. Thêm `storage.ts` / `query-keys.ts` **chỉ khi** feature tương ứng xuất hiện
7. Đổi prefix storage (`myapp:`) và tên domain cho khớp sản phẩm

---

## 13. Những gì cố ý không nằm trong constants

| Không đưa vào | Lý do / thay thế |
|---------------|------------------|
| Secret, private key | `.env`, secret manager |
| Copy marketing dài / i18n | Thư viện i18n (`next-intl`, …) |
| Config theme phức tạp | Design tokens / CSS variables / theme file |
| Feature flag động | Remote config / env, không hardcode cả ma trận flag |

---

*Sườn dùng cho mọi dự án React/Next.js. Nhân bản file này vào `docs/` của repo mới và thay ví dụ domain cho phù hợp.*
