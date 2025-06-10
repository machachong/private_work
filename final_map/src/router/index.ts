// const Layouts = () => import("@/layouts/index.vue")
import { createRouter, createWebHashHistory } from "vue-router";
export const routes = [
  {
    path: "/",
    // component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("../pages/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true,
        },
      }, {
        path: "trend",
        component: () => import("../pages/dashboard/Trend.vue"),
        name: "Trend",
        meta: {
          title: "趋势",
          svgIcon: "dashboard",
          affix: true,
        },
      },
      {      
        path: "/list",
        component: () => import("../pages/list/List.vue"),
        name: "List",
        meta: {
          title: "报价列表",
          svgIcon: "List",
          affix: true,
        },
      },
      {      
        path: "/detail",
        component: () => import("../pages/list/Detail.vue"),
        name: "Detail",
        meta: {
          title: "报价详情",
          svgIcon: "Detail",
          affix: true,
        },
      }

      
     
    ],
  },
  
];
export const router = createRouter({
  history: createWebHashHistory("/frontpage/"),
  routes: routes,
});
