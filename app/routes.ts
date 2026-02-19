import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/root/root-layout.tsx", [index("routes/root/index.tsx")]),
] satisfies RouteConfig;
