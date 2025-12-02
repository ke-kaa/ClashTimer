import apiClient from "./apiClient";

export const getAccountsForDashboard = async function () {
    try {
        const response = await apiClient.get("/accounts/dashboard");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const getVillage = async function (playerTag) {
    try {
        const normalizedTag = playerTag.startsWith("#")
            ? playerTag
            : `#${playerTag}`;
        const response = await apiClient.get(
            `/accounts/dashboard/addVillage/${encodeURIComponent(
                normalizedTag
            )}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Unknown error occurred." };
    }
};

export const addVillage = async function ({ cacheKey }) {
    try {
        const response = await apiClient.post(
            `/accounts/dashboard/addVillage/add`,
            {
                cacheKey,
            }
        );
    } catch (error) {
        throw error.response?.data || { message: "Unknown error occurred." };
    }
};

export const getVillageForDetailPage = async function (playerTag) {
    try {
        const normalizedTag = playerTag.startsWith("#")
            ? playerTag
            : `#${playerTag}`;
        const response = await apiClient.get(
            `/accounts/${encodeURIComponent(normalizedTag)}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Unknown error occurred." };
    }
};

export const sendVillagePasteData = async function (playerData) {
    try {
        const response = await apiClient.post("/accounts/paste", playerData);
        console.log("account data being sent from the ront end");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Unknown error occurred." };
    }
};

export const getVillageOverviewDashboard = async function () {
    try {
        const response = await apiClient.get("/accounts/dashboard/overview");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Unknown error occured." };
    }
};
