import { useState, useEffect } from "react";
import { getProfile, updateEmployerInfo, updateJobSeekerInfo } from "../api/user";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const { roles } = useAuth(); // Pobranie roli użytkownika
    const [profile, setProfile] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    companyName: data.companyName || "",
                    companyWebsite: data.companyWebsite || ""
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (roles?.includes("ROLE_EMPLOYER")) {
                await updateEmployerInfo(formData.companyName, formData.companyWebsite);
            } else if (roles?.includes("ROLE_JOB_SEEKER")) {
                await updateJobSeekerInfo(formData.firstName, formData.lastName);
            }
            setIsEditing(false);
            const updatedProfile = await getProfile();
            setProfile(updatedProfile);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            {roles?.includes("ROLE_EMPLOYER") ? (
                <>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Company Name:</strong> {isEditing ? <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} /> : profile.companyName}</p>
                    <p><strong>Company Website:</strong> {isEditing ? <input type="text" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} /> : profile.companyWebsite}</p>
                </>
            ) : roles?.includes("ROLE_JOB_SEEKER") ? (
                <>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>First Name:</strong> {isEditing ? <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} /> : profile.firstName}</p>
                    <p><strong>Last Name:</strong> {isEditing ? <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} /> : profile.lastName}</p>
                </>
            ) : (
                <p>Unknown role</p>
            )}
            <button 
                className="bg-blue-500 rounded text-white mt-4 px-4 py-2"
                onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
            >
                {isEditing ? "Save" : "Edit"}
            </button>
        </div>
    );
};

export default Profile;
