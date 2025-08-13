import { regsitrationService } from "../services/authService.js";

export async function registerUserController(req, res) {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email and password are required' });
    }

    try {

        const result = await regsitrationService({username, email, password});
        return res.status(201).json(result);

    }
    catch (error) {
        if (error.status === 400 || error.status === 409 || error.message === 'User already exists'){
            return res.status(error.status || 400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
