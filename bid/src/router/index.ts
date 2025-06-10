// const Layouts = () => import("@/layouts/index.vue")
import { createRouter, createWebHashHistory } from "vue-router";
export const routes = [
  {
    path: "/",
    // component: Layouts,
    redirect: "/list",
    children: [
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
      },
      {
        path: "/company",
        component: () => import("../pages/company/List.vue"),
        name: "Company",
        meta: {
          title: "公司列表",
          svgIcon: "List",
          affix: true,
        },
      },
      {
        path: "/company/detail",
        component: () => import("../pages/company/Detail.vue"),
        name: "CompanyDetail",
        meta: {
          title: "公司详情",
          svgIcon: "Detail",
          affix: true,
        },
      },
    ],
  },
];
export const router = createRouter({
  history: createWebHashHistory("/frontpage/"),
  routes: routes,
});
