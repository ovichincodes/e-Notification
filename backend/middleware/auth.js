const Cryptr = require("cryptr");

// init cryptr with the secret key
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

function auth(req, res, next) {
	// get token
	const token = req.header("x-auth-token");

	// check for token
	if (!token)
		return res.status(401).json({ msg: "No token, Authorization failed!" });

	try {
		// verify token
		const decryptedString = cryptr.decrypt(token);
		req.user_id = decryptedString;
		next();
	} catch (e) {
		return res.status(400).json({ msg: "Invalid Token!" });
	}
}

module.exports = auth;
