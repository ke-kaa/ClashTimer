import apiClient from "./apiClient";
import { getCategorySlug } from "../utils/categorySlug.js";

const upgradeService = {
    start: async (accountId, category, itemId, payload) => {
        const slug = getCategorySlug(category);
        return await apiClient.post(
            `/${slug}/${accountId}/${itemId}/upgrade/start`,
            payload
        );
    },

    cancel: async (accountId, category, itemId) => {
        const slug = getCategorySlug(category);
        return await apiClient.post(
            `/${slug}/${accountId}/${itemId}/upgrade/cancel`
        );
    },

    finish: async (accountId, category, itemId) => {
        const slug = getCategorySlug(category);
        return await apiClient.post(
            `/${slug}/${accountId}/${itemId}/upgrade/finish`
        );
    },

    update: async (accountId, category, itemId, payload) => {
        const slug = getCategorySlug(category);
        return await apiClient.post(
            `/${slug}/${accountId}/${itemId}/upgrade/update`,
            payload
        );
    },
};

export default upgradeService;
