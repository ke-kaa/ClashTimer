import apiClient from "./apiClient";
import { getCategorySlug } from "../utils/categorySlug.js";

const upgradeService = {
    start: (accountId, category, itemId, payload) => {
        const slug = getCategorySlug(category);
        console.log(payload);
        return apiClient.post(
            `/${slug}/${accountId}/${itemId}/upgrade/start`,
            payload
        );
    },

    cancel: (accountId, category, itemId) => {
        const slug = getCategorySlug(category);
        return apiClient.post(`/${slug}/${accountId}/${itemId}/upgrade/cancel`);
    },

    finish: (accountId, category, itemId) => {
        const slug = getCategorySlug(category);
        return apiClient.post(`/${slug}/${accountId}/${itemId}/upgrade/finish`);
    },
};

export default upgradeService;
