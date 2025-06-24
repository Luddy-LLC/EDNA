import { msalGetToken } from '../auth/ms-auth.js';

export class GraphAPI {

    constructor() { }

    async get(endpoint, type = "json") {
        const url = `https://graph.microsoft.com/v1.0/${endpoint}`;

        try {
            const token = await msalGetToken(["User.Read", "User.ReadBasic.All"]);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            switch (type) {
                case "json":
                    return await response.json();
                case "text":
                    return await response.text();
                case "blob":
                    return await response.blob();
                case "arrayBuffer":
                    return await response.arrayBuffer();
                case "formData":
                    return await response.formData();
                default:
                    return await response.json();
            }

        } catch {

        }

    }


    async post(endpoint, data) {
        const url = `https://graph.microsoft.com/v1.0/${endpoint}`;

        try {
            const token = await msalGetToken;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Graph API error:", error);
            throw error;
        }
    }

    async me(dataPart) {
        return dataPart ? this.get("me").then(r => r[dataPart]) : await this.get("me");
    }

    async myPhoto() { return URL.createObjectURL(await this.get('me/photo/$value', 'blob')); }

    async profile(upn, dataPart) {
        return dataPart ? this.get(`users/${upn}`).then(r => r[dataPart]) : await this.get(`users/${upn}`);
    }

    async profilePhoto(upn) { return URL.createObjectURL(await this.get(`users/${upn}/photo/$value`, 'blob')); }

}

document.querySelectorAll('[login]').forEach((el) => {
    el.addEventListener("click", () => {
        msalGetToken();
    })
})