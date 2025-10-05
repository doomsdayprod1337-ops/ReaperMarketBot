import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import("../views/DashboardView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/chat",
            name: "chat",
            component: () => import("../views/ChatView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/news",
            name: "news",
            component: () => import("../views/NewsView.vue"),
        },
        {
            path: "/wiki",
            name: "wiki",
            component: () => import("../views/WikiView.vue"),
        },
        {
            path: "/guides",
            name: "guides",
            component: () => import("../views/GuidesView.vue"),
        },
        {
            path: "/downloads",
            name: "downloads",
            component: () => import("../views/DownloadsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/bin-checker",
            name: "bin-checker",
            component: () => import("../views/BinCheckerView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/generate-fp",
            name: "generate-fp",
            component: () => import("../views/GenerateFpView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/credentials",
            name: "credentials",
            component: () => import("../views/CredentialsView.vue"),
            meta: { requiresAuth: true }
        },
            {
                path: "/token-dumper",
                name: "token-dumper",
                component: () => import("../views/TokenDumperView.vue"),
                meta: { requiresAuth: true }
            },
            {
                path: "/checkout",
                name: "checkout",
                component: () => import("../views/CheckoutView.vue"),
                meta: { requiresAuth: true }
            },
        {
            path: "/splash",
            name: "splash",
            component: () => import("../views/SplashView.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
        },
        {
            path: "/register",
            name: "register",
            component: () => import("../views/RegisterView.vue"),
        },
        {
            path: "/marketplace",
            name: "marketplace",
            component: () => import("../views/MarketplaceView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("../views/ProfileView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/notifications",
            name: "notifications",
            component: () => import("../views/NotificationsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/purchases",
            name: "purchases",
            component: () => import("../views/PurchasesView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/cart",
            name: "cart",
            component: () => import("../views/CartView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/bots",
            name: "bots",
            component: () => import("../views/BotsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/services",
            name: "services",
            component: () => import("../views/ServicesView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/wallet",
            name: "wallet",
            component: () => import("../views/WalletView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/product/:id",
            name: "product",
            component: () => import("../views/ProductView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/bot/:id",
            name: "bot",
            component: () => import("../views/BotView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/service/:id",
            name: "service",
            component: () => import("../views/ServiceView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/checkout",
            name: "checkout",
            component: () => import("../views/CheckoutView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/orders/:id",
            name: "order",
            component: () => import("../views/OrderView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/tasks",
            name: "tasks",
            component: () => import("../views/TasksView.vue"),
        },
        {
            path: "/friends",
            name: "friends",
            component: () => import("../views/FriendsView.vue"),
        },
        {
            path: "/credit-cards",
            name: "credit-cards",
            component: () => import("../views/CreditCardsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/documents",
            name: "documents",
            component: () => import("../views/DocumentsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/finance-documents",
            name: "finance-documents",
            component: () => import("../views/FinanceDocsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/checker-files",
            name: "checker-files",
            component: () => import("../views/CheckerFilesView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/inbox-requests",
            name: "inbox-requests",
            component: () => import("../views/InboxRequestsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/transactions",
            name: "transactions",
            component: () => import("../views/TransactionsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/referrals",
            name: "referrals",
            component: () => import("../views/ReferralsView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/tickets",
            name: "tickets",
            component: () => import("../views/TicketsView.vue"),
            meta: { requiresAuth: true }
        },
    ],
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('marketplace_token');
    const isAuthenticated = !!token;
    const hasSeenSplash = localStorage.getItem('has_seen_splash');

    // Redirect to splash screen on first visit (except for splash itself)
    if (!hasSeenSplash && to.name !== 'splash') {
        localStorage.setItem('has_seen_splash', 'true');
        next('/splash');
        return;
    }

    // Redirect to login if authentication is required but user is not logged in
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } 
    // Redirect authenticated users away from login/register/splash pages
    else if (isAuthenticated && (to.name === 'login' || to.name === 'register' || to.name === 'splash')) {
        next('/');
    } 
    else {
        next();
    }
});

export default router;
