// import { NextResponse } from "next/server";

const { auth } = require("@/app/_lib/auth");

// export function middleware(req, res) {
//   console.log(req);

//   return NextResponse.redirect(new URL("/about", req.url));
// }

export const middleware = auth;
export const config = {
  matcher: ["/account"],
};
