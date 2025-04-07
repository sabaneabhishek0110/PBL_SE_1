import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email"); // Get email from URL
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Both password fields are required.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users/set-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: newPassword })
            });

            if (!response.ok) {
                throw new Error("Failed to set password");
            }
            console.log("djkfhjdhfjdhfj")
            setSuccess(true);
            setError("");

            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            setError("Error setting password. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
                <h2 className="text-2xl font-semibold mb-4 text-center">Set Your Password</h2>
                <p className="text-gray-400 mb-4 text-center">
                    Email: <span className="text-gray-300">{email}</span>
                </p>

                <input
                    type="password"
                    className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full p-2 mb-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-2">Password set successfully! Redirecting...</p>}

                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition duration-200"
                    onClick={handleSetPassword}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default SetPassword;
