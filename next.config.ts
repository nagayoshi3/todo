import type { NextConfig } from "next";

// GitHub Pages のプロジェクトページは /<repo>/ 配下で配信されるため、
// CI では BASE_PATH=/todo を渡してアセットのパスを合わせる。
// ローカル（未設定）ではルート配信になる。
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // すべてクライアント側で動くアプリなので、静的ファイルとして書き出せる。
  // `npm run build` で out/ が生成され、任意の静的サーバーで配信できる。
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
