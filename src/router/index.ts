import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PageBase from "@/views/PageBase.vue";
import JionlpOnlineBase from "@/views/jionlp_online/JionlpOnlineBase.vue";
import BlogBase from "@/views/blog/BlogBase.vue";
import EditBlogBase from "@/views/editblog/EditBlogBase.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "HomePage",
    component: PageBase, // () => import('@/views/HomePageBase.vue'),
    children: [
      {
        path: "",
        name: "HomePageContent",
        component: () => import("@/views/HomePageContent.vue"),
      },
    ],
  },

  {
    path: "/jionlp_online",
    name: "JionlpOnline",
    component: JionlpOnlineBase,
    children: [
      {
        path: "",
        name: "JionlpOnlineHome",
        component: () =>
          import("@/views/jionlp_online/JionlpOnlineDefaultContent.vue"),
      },
      {
        path: "parse_time",
        name: "ParseTime",
        component: () => import("@/components/jionlp_online/ParseTime.vue"),
      },
      {
        path: "extract_time",
        name: "ExtractTime",
        component: () => import("@/components/jionlp_online/ExtractTime.vue"),
      },
      {
        path: "parse_location",
        name: "ParseLocation",
        component: () => import("@/components/jionlp_online/ParseLocation.vue"),
      },
      {
        path: "clean_text",
        name: "CleanText",
        component: () => import("@/components/jionlp_online/CleanText.vue"),
      },
      {
        path: "parse_money",
        name: "ParseMoney",
        component: () => import("@/components/jionlp_online/ParseMoney.vue"),
      },
      {
        path: "parse_id_card",
        name: "ParseIDCard",
        component: () => import("@/components/jionlp_online/ParseIDCard.vue"),
      },
      // {
      //   path: "back_translation",
      //   name: "BackTranslation",
      //   component: () =>
      //     import("@/components/jionlp_online/BackTranslation.vue"),
      // },

      // {
      //   path: "homophone_substitution",
      //   name: "HomophoneSubstitution",
      //   component: () =>
      //     import("@/components/jionlp_online/HomophoneSubstitution.vue"),
      // },
    ],
  },

  {
    path: "/blog/:first_directory/:blog_id",
    name: "Blog",
    component: BlogBase,
  },

  {
    path: "/editblog/:blog_id",
    name: "EditBlog",
    component: EditBlogBase,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
