const Koa = require("koa");
const Router = require("@koa/router");
const jwt = require("koa-jwt");
const app = new Koa();

const route = new Router();

route.post("/", (ctx) => {
  if (ctx.request.body.password === "password") {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({ role: "admin" }, "uppercod-15-03-2022"),
      message: "logged-in",
    };
  } else {
    ctx.status = ctx.status = 401;
    ctx.body = {
      message: "Invalid password",
    };
  }
  return ctx;
});

route.get("/", (ctx) => {
  ctx.status = 200;
  ctx.body = {};
});

app.use(route.routes()).use(route.allowedMethods());

app.listen(8080);
