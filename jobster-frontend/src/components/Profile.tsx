import { useState, useEffect } from "react";
import { getProfile, updateEmployerInfo, updateJobSeekerInfo } from "../api/user";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaSave } from "react-icons/fa";

const Profile = () => {
    const { roles } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
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
        } finally {
            setSaving(false);
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
                    {roles?.includes("ROLE_EMPLOYER") ? (
                        <>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Company name</strong></Form.Label>
                                {isEditing ? (
                                    <Form.Control type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                                ) : (
                                    <p className="form-control-plaintext">{profile.companyName}</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Company website</strong></Form.Label>
                                {isEditing ? (
                                    <Form.Control type="text" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
                                ) : (
                                    <p className="form-control-plaintext">{profile.companyWebsite}</p>
                                )}
                            </Form.Group>
                        </>
                    ) : roles?.includes("ROLE_JOB_SEEKER") ? (
                        <>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>First Name</strong></Form.Label>
                                {isEditing ? (
                                    <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                                ) : (
                                    <p className="form-control-plaintext">{profile.firstName}</p>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Last Name</strong></Form.Label>
                                {isEditing ? (
                                    <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                                ) : (
                                    <p className="form-control-plaintext">{profile.lastName}</p>
                                )}
                            </Form.Group>
                        </>
                    ) : (
                        <p className="text-danger">Unknown role</p>
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