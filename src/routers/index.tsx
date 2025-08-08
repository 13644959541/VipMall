import type { White } from "@/typings"
import { lazy } from "react"
const Home = lazy(() => import(/* chunkName: Home */ "@/pages/HomeWrapper"))
const Index = lazy(() => import(/* chunkName: Index */ "@/pages/Index"))
const NoFound = lazy(() => import(/* chunkName: NoFound */ "../components/NoFound"))

const TabBarList: Array<White.RouteTabBar> = [
  {
    path: "/",
    component: Home, 
    icon: "white-home1",
    sceneMode: "scroll",
    title: "商城兑换",
  }
]

const routes: White.RouteConfig[] = [
  {
    path: "/",
    component: Index,
    tabBars: TabBarList,
  },
  {
    path: "*",
    component: NoFound,
  },
]

export { TabBarList }
 export default [...routes]
