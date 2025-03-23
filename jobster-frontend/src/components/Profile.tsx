import { useState, useEffect } from "react";
import { getProfile, updateEmployerInfo, updateJobSeekerInfo, uploadCv } from "../api/user";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaSave, FaUpload } from "react-icons/fa";

interface ProfileData {
    email: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    companyWebsite?: string;
    cvUrl?: string; // Add a field to store the uploaded CV URL
}

interface FormData {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    companyWebsite?: string;
}

const Profile: React.FC = () => {
    const { roles } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [uploadingCv, setUploadingCv] = useState<boolean>(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data: ProfileData = await getProfile();
                setProfile(data);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    companyName: data.companyName || "",
                    companyWebsite: data.companyWebsite || ""
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            if (roles?.includes("ROLE_EMPLOYER")) {
                await updateEmployerInfo(formData.companyName || "", formData.companyWebsite || "");
            } else if (roles?.includes("ROLE_JOB_SEEKER")) {
                await updateJobSeekerInfo(formData.firstName || "", formData.lastName || "");
            }
            setIsEditing(false);
            const updatedProfile = await getProfile();
            setProfile(updatedProfile);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleCvUpload = async () => {
        if (cvFile) {
            try {
                setUploadingCv(true);
                await uploadCv(cvFile); // Call the function to upload the CV
                const updatedProfile = await getProfile(); // Fetch updated profile after CV upload
                setProfile(updatedProfile);
                alert("CV uploaded successfully!");
            } catch (error) {
                console.error("Error uploading CV:", error);
                alert("Error uploading CV.");
            } finally {
                setUploadingCv(false);
            }
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
                <p>Loading profile...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4 text-center">User Profile</Card.Title>
                    {profile && (
                        <>
                            <p><strong>Email:</strong> {profile.email}</p>
                            {roles?.includes("ROLE_EMPLOYER") ? (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Company Name</strong></Form.Label>
                                        {isEditing ? (
                                            <Form.Control type="text" name="companyName" value={formData.companyName || ""} onChange={handleChange} />
                                        ) : (
                                            <p className="form-control-plaintext">{profile.companyName || "N/A"}</p>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Company Website</strong></Form.Label>
                                        {isEditing ? (
                                            <Form.Control type="text" name="companyWebsite" value={formData.companyWebsite || ""} onChange={handleChange} />
                                        ) : (
                                            <p className="form-control-plaintext">{profile.companyWebsite || "N/A"}</p>
                                        )}
                                    </Form.Group>
                                </>
                            ) : roles?.includes("ROLE_JOB_SEEKER") ? (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>First Name</strong></Form.Label>
                                        {isEditing ? (
                                            <Form.Control type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} />
                                        ) : (
                                            <p className="form-control-plaintext">{profile.firstName || "N/A"}</p>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Last Name</strong></Form.Label>
                                        {isEditing ? (
                                            <Form.Control type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} />
                                        ) : (
                                            <p className="form-control-plaintext">{profile.lastName || "N/A"}</p>
                                        )}
                                    </Form.Group>
                                </>
                            ) : (
                                <p className="text-danger">Unknown role</p>
                            )}
                            {/* CV Upload Section */}
                            {roles?.includes("ROLE_JOB_SEEKER") && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Upload CV</strong></Form.Label>
                                        <Form.Control type="file" onChange={handleCvChange} />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        onClick={handleCvUpload}
                                        disabled={uploadingCv || !cvFile}
                                    >
                                        {uploadingCv ? <Spinner size="sm" animation="border" className="me-2" /> : <FaUpload className="me-2" />}
                                        {uploadingCv ? "Uploading..." : "Upload CV"}
                                    </Button>
                                </>
                            )}
                        </>
                    )}

                    <div className="text-center mt-4">
                        {isEditing ? (
                            <Button variant="success" onClick={handleSubmit} disabled={saving}>
                                {saving ? <Spinner size="sm" animation="border" className="me-2" /> : <FaSave className="me-2" />}
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={() => setIsEditing(true)}>
                                <FaEdit className="me-2" /> Edit
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
