"use server"

export interface MetaData {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    categoryId: string;
    technicianProfileId: string;
    category?: Category;
    technicianProfile?: {
        id: string;
        user: {
            name: string;
        };
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface TechnicianReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer?: {
        name: string;
        email?: string;
    };
}

export interface TechnicianProfile {
    id: string;
    userId: string;
    bio?: string | null;
    skills: string[];
    experienceYears?: number;
    hourlyRate?: number;
    location?: string | null;
    rating: number;
    isAvailable: boolean;
    user: {
        name: string;
        email: string;
    };
    reviews?: TechnicianReview[];
    createdAt?: string;
    updatedAt?: string;
}

const getBackendUrl = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const getPublicCategoriesAction = async (params?: { page?: number; limit?: number; searchTerm?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.searchTerm) query.append("searchTerm", params.searchTerm);

    try {
        const res = await fetch(`${getBackendUrl()}/api/categories?${query.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60, tags: ["public-categories"] }
        });
        return await res.json();
    } catch (error) {
        console.error("getPublicCategoriesAction error:", error);
        return { success: false, data: [] };
    }
};

export const getPublicServicesAction = async (params?: { page?: number; limit?: number; searchTerm?: string; categoryId?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
    if (params?.categoryId) query.append("categoryId", params.categoryId);

    try {
        const res = await fetch(`${getBackendUrl()}/api/services?${query.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60, tags: ["public-services"] }
        });
        return await res.json();
    } catch (error) {
        console.error("getPublicServicesAction error:", error);
        return { success: false, data: [] };
    }
};

export const getPublicTechniciansAction = async (params?: { page?: number; limit?: number; searchTerm?: string; location?: string; rating?: string; skills?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
    if (params?.location) query.append("location", params.location);
    if (params?.rating) query.append("rating", params.rating);
    if (params?.skills) query.append("skills", params.skills);

    try {
        const res = await fetch(`${getBackendUrl()}/api/technicians?${query.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60, tags: ["public-technicians"] }
        });
        return await res.json();
    } catch (error) {
        console.error("getPublicTechniciansAction error:", error);
        return { success: false, data: [] };
    }
};

export const getSingleTechnicianAction = async (id: string) => {
    try {
        const res = await fetch(`${getBackendUrl()}/api/technicians/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60, tags: [`public-technician-${id}`] }
        });
        return await res.json();
    } catch (error) {
        console.error("getSingleTechnicianAction error:", error);
        return { success: false, data: null };
    }
};
