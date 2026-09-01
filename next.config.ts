import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // すべてクライアント側で動くアプリなので、静的ファイルとして書き出せる。
  // `npm run build` で out/ が生成され、任意の静的サーバーで配信できる。
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
