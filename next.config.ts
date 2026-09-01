import type { NextConfig } from "next";

// 静的書き出しは GitHub Pages 向けのときだけ有効にする。
// Vercel は通常の Next.js ビルド成果物を配信するため、out/ を作ると
// ページが拾われず 404 になる。
const staticExport = process.env.STATIC_EXPORT === "1";

// GitHub Pages のプロジェクトページは /<repo>/ 配下で配信されるため、
// CI では BASE_PATH=/todo を渡してアセットのパスを合わせる。
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath,
  ...(staticExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
