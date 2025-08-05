import type { White } from "@/typings"
import { lazy } from "react"
const Search = lazy(() => import(/* chunkName: "Search" */ "@/pages/Search"))
const List = lazy(() => import(/* chunkName: List */ "@/pages/List"))
const Home = lazy(() => import(/* chunkName: Home */ "@/pages/HomeWrapper"))
const Detail = lazy(() => import(/* chunkName: Detail */ "@/pages/Detail"))
const Index = lazy(() => import(/* chunkName: Index */ "@/pages/Index"))
const Other = lazy(() => import(/* chunkName: Other */ "@/pages/Other"))
const Other1 = lazy(() => import(/* chunkName: Other1 */ "@/pages/Other1"))
const NoFound = lazy(() => import(/* chunkName: NoFound */ "../components/NoFound"))
// 导入新的 Waitlist 和 FoodOrdering 组件
const Waitlist = lazy(() => import(/* chunkName: Waitlist */ "@/pages/Waitlist"))
const FoodOrdering = lazy(() => import(/* chunkName: FoodOrdering */ "@/pages/FoodOrdering"))

const TabBarList: Array<White.RouteTabBar> = [
  {
    path: "/",
    component: Home, // 保持 HomeWrapper 作为 TabBar 的首页，但根路径会指向 Waitlist
    icon: "white-home1",
    sceneMode: "scroll",
    title: "商城兑换",
  },
  {
    path: "/detail",
    component: Detail,
    icon: "white-tradingdata",
    sceneMode: "scroll",
    title: "兑换记录",
  },
  {
    path: "/list",
    component: List,
    icon: "white-order",
    sceneMode: "scroll",
    title: "购物车",
  },
  {
    path: '/food-ordering',
    component: Search,
    icon: 'white-account',
    sceneMode: 'scroll',
    title: '食品订购',
  },
]

const routes: White.RouteConfig[] = [
  {
    path: "/",
    component: Index,
    tabBars: TabBarList,
  },
  {
    path: "/waitlist",
    component: Waitlist,
  },
  {
    path: "/food-ordering",
    component: FoodOrdering,
  },
  {
    path: "/other",
    component: Other,
  },
  {
    path: "/other1",
    sceneMode: "bottom",
    component: Other1,
  },
  {
    path: "/dcotorDetail",
    component: Detail,
  },
  {
    path: "*",
    component: NoFound,
  },
]

export { TabBarList }
export default [...routes]
