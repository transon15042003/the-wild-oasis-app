// import { NextResponse } from "next/server";

// export function middleware(req, res) {
//   console.log(req);

//   return NextResponse.redirect(new URL("/about", req.url));
// }

const { auth } = require("@/app/_lib/auth");

export const middleware = auth;
export const config = {
    matcher: ["/account"],
};
