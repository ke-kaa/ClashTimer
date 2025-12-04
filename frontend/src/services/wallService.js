import apiClient from "./apiClient";

export const startWallUpgrade = async (accountId, payload) => {
    try {
        const response = await apiClient.patch(
            `/walls/${accountId}/upgrade`,
            payload
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
