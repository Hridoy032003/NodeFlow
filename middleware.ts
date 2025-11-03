export { default } from "next-auth/middleware";
export { default as middleware } from "next-auth/middleware";
export const config = {
  matcher: [
    "/editor/:path*",
    "/dashboard/:path*",
    "/api/workflows/:path*",
  ],
};
