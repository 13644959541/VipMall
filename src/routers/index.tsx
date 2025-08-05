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

export const TabBarList: Array<White.RouteTabBar> = [
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
  // {
  //   path: '/search',
  //   component: Search,
  //   icon: 'white-account',
  //   sceneMode: 'scroll',
  //   title: '我的',
  // },
]

const routes: White.RouteConfig[] = [
  {
    path: "/",
    component: Waitlist, // 将根路径指向新的 Waitlist 页面
  },
  {
    path: "/food-ordering", // 新增食品订购页面路径
    component: FoodOrdering,
    sceneMode: "right", // 可以根据需要调整进入动画
    title: "食品订购",
  },
  {
    path: "/index", // 将原来的 Index 页面作为 TabBar 的父路由
    component: Index,
    tabBars: TabBarList,
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

export default [...routes]
