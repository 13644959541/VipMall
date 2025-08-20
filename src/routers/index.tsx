import type { White } from "@/typings"
import { lazy } from "react"
const Home = lazy(() => import(/* chunkName: Home */ "@/pages/HomeWrapper"))
const Index = lazy(() => import(/* chunkName: Index */ "@/pages/Index"))
const ProductDetail = lazy(() => import(/* chunkName: ProductDetail */ "@/pages/ProductDetail"))
const NoFound = lazy(() => import(/* chunkName: NoFound */ "../components/NoFound"))

const routes: White.RouteConfig[] = [
  {
    path: "/",
    component: Index,
    tabBars: [
      {
        path: "/",
        component: Home,
        icon: "white-home", 
        sceneMode: "scroll",
        title: "商城兑换"
      }
    ],
  },
  {
    path: "/product/:id",
    component: ProductDetail,
  },
  {
    path: "/cart",
    component: lazy(() => import(/* chunkName: Cart */ "@/pages/Cart")),
  },
  {
    path: "/record",
    component: lazy(() => import(/* chunkName: PaymentRecord */ "@/pages/PaymentRecord")),
  },
  {
    path: "*",
    component: NoFound,
  },
]

export default [...routes]
