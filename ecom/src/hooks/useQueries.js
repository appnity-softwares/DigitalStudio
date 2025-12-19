import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// ============================================
// PRODUCTS
// ============================================

export const useProducts = (filters = {}) => {
    const { category, search, page = 1, limit = 12 } = filters;

    return useQuery({
        queryKey: ['products', { category, search, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (search) params.append('search', search);
            params.append('page', page);
            params.append('limit', limit);

            try {
                const res = await api.get(`/products?${params.toString()}`);
                return res.data || { products: [] };
            } catch (error) {
                console.error('Failed to fetch products:', error);
                return { products: [] };
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data.product || res.data;
        },
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: async () => {
            const res = await api.get('/products/featured');
            return res.data.products || res.data;
        },
        staleTime: 15 * 60 * 1000, // 15 minutes
    });
};

// ============================================
// PREMIUM DOCS
// ============================================

export const useDocs = (filters = {}) => {
    const { category, page = 1, limit = 12 } = filters;

    return useQuery({
        queryKey: ['docs', { category, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            params.append('page', page);
            params.append('limit', limit);

            const res = await api.get(`/docs?${params.toString()}`);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useDoc = (id) => {
    return useQuery({
        queryKey: ['doc', id],
        queryFn: async () => {
            const res = await api.get(`/docs/${id}`);
            return res.data.doc || res.data;
        },
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};

// ============================================
// SAAS TOOLS
// ============================================

export const useSaasTools = (category = null) => {
    return useQuery({
        queryKey: ['saas-tools', category],
        queryFn: async () => {
            const url = category ? `/saas?category=${category}` : '/saas';
            const res = await api.get(url);
            return res.data.tools || res.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

export const useSaasTool = (id) => {
    return useQuery({
        queryKey: ['saas-tool', id],
        queryFn: async () => {
            const res = await api.get(`/saas/${id}`);
            return res.data.tool || res.data;
        },
        enabled: !!id,
    });
};

export const useMyApiKeys = () => {
    return useQuery({
        queryKey: ['my-api-keys'],
        queryFn: async () => {
            const res = await api.get('/saas/my-keys');
            return res.data.apiKeys || [];
        },
        staleTime: 2 * 60 * 1000,
    });
};

export const useGenerateApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ toolId, name }) => {
            const res = await api.post(`/saas/${toolId}/generate-key`, { name });
            return res.data.apiKey;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-api-keys'] });
        },
    });
};

// ============================================
// ORDERS
// ============================================

export const useMyOrders = () => {
    return useQuery({
        queryKey: ['my-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/mine');
            return res.data.orders || res.data;
        },
        staleTime: 2 * 60 * 1000,
    });
};

export const useOrder = (id) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const res = await api.get(`/orders/${id}`);
            return res.data.order || res.data;
        },
        enabled: !!id,
    });
};

// ============================================
// REVIEWS
// ============================================

export const useProductReviews = (productId, productType = 'product') => {
    return useQuery({
        queryKey: ['reviews', productType, productId],
        queryFn: async () => {
            const endpoint = productType === 'doc'
                ? `/reviews/doc/${productId}`
                : `/reviews/product/${productId}`;
            const res = await api.get(endpoint);
            return res.data.reviews || [];
        },
        enabled: !!productId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useSubmitReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reviewData) => {
            const res = await api.post('/reviews', reviewData);
            return res.data.review;
        },
        onSuccess: (data, variables) => {
            const type = variables.docId ? 'doc' : 'product';
            const id = variables.docId || variables.productId;
            queryClient.invalidateQueries({ queryKey: ['reviews', type, id] });
        },
    });
};

// ============================================
// WISHLIST
// ============================================

export const useWishlist = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const res = await api.get('/wishlist');
            return res.data.wishlist?.items || [];
        },
        staleTime: 2 * 60 * 1000,
    });
};

export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, premiumDocId }) => {
            const res = await api.post('/wishlist', { productId, premiumDocId });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (itemId) => {
            await api.delete(`/wishlist/${itemId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });
};

// ============================================
// INVOICES
// ============================================

export const useInvoices = () => {
    return useQuery({
        queryKey: ['invoices'],
        queryFn: async () => {
            const res = await api.get('/invoices');
            return res.data.invoices || [];
        },
        staleTime: 5 * 60 * 1000,
    });
};

// ============================================
// SUBSCRIPTIONS
// ============================================

export const useCurrentSubscription = () => {
    return useQuery({
        queryKey: ['current-subscription'],
        queryFn: async () => {
            const res = await api.get('/subscriptions/current');
            return res.data.subscription;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// ============================================
// SEARCH
// ============================================

export const useSearchSuggestions = (query) => {
    return useQuery({
        queryKey: ['search-suggestions', query],
        queryFn: async () => {
            const res = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
            return res.data.suggestions || [];
        },
        enabled: query.length >= 2,
        staleTime: 30 * 1000, // 30 seconds
    });
};

export const usePopularSearches = () => {
    return useQuery({
        queryKey: ['popular-searches'],
        queryFn: async () => {
            const res = await api.get('/search/popular');
            return res.data.popularSearches || [];
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};

// ============================================
// ADMIN DASHBOARD
// ============================================

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['admin', 'dashboard-stats'],
        queryFn: async () => {
            const res = await api.get('/dashboard/stats');
            return res.data;
        },
        staleTime: 60 * 1000, // 1 minute
    });
};

export const useRevenueChart = (period = '30d') => {
    return useQuery({
        queryKey: ['admin', 'revenue-chart', period],
        queryFn: async () => {
            const res = await api.get(`/dashboard/revenue?period=${period}`);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useTopProducts = () => {
    return useQuery({
        queryKey: ['admin', 'top-products'],
        queryFn: async () => {
            const res = await api.get('/dashboard/top-products');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useUserGrowth = () => {
    return useQuery({
        queryKey: ['admin', 'user-growth'],
        queryFn: async () => {
            const res = await api.get('/dashboard/user-growth');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// ============================================
// COUPONS
// ============================================

export const useValidateCoupon = () => {
    return useMutation({
        mutationFn: async ({ code, orderTotal }) => {
            const res = await api.post('/coupons/validate', { code, orderTotal });
            return res.data;
        },
    });
};

// ============================================
// UTILITY HOOKS
// ============================================

export const usePrefetchProduct = () => {
    const queryClient = useQueryClient();

    return (productId) => {
        queryClient.prefetchQuery({
            queryKey: ['product', productId],
            queryFn: async () => {
                const res = await api.get(`/products/${productId}`);
                return res.data.product || res.data;
            },
        });
    };
};
