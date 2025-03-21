import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { createJobPost } from "../api/jobPosts";
import { ExperienceLevel } from "../enums/ExperienceLevel";
import { JobType } from "../enums/JobType";
import { ContractType } from "../enums/ContractType";
import { toast } from "react-toastify";

const experienceLevels = Object.values(ExperienceLevel);
const jobTypes = Object.values(JobType);
const contractTypes = Object.values(ContractType);

export default function CreateJobPost() {
  const [form, setForm] = useState({
    title: "",
    jobTitle: "",
    jobFunction: "",
    location: "",
    description: "",
    monthlySalary: "",
    demandedSkills: "",
    experienceLevel: "SENIOR",
    jobType: "FULL_TIME",
    contractType: "REGULAR",
    remote: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    jobTitle: "",
    location: "",
    description: "",
    monthlySalary: "",
    demandedSkills: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    if (!form.title) {
      formErrors.title = "Title is required";
      isValid = false;
    } else {
      formErrors.title = "";
    }

    if (!form.jobTitle) {
      formErrors.jobTitle = "Job Title is required";
      isValid = false;
    } else {
      formErrors.jobTitle = "";
    }

    if (!form.location) {
      formErrors.location = "Location is required";
      isValid = false;
    } else {
      formErrors.location = "";
    }

    if (!form.description) {
      formErrors.description = "Description is required";
      isValid = false;
    } else {
      formErrors.description = "";
    }

    if (!form.monthlySalary || isNaN(Number(form.monthlySalary))) {
      formErrors.monthlySalary = "Please enter a valid salary";
      isValid = false;
    } else {
      formErrors.monthlySalary = "";
    }

    if (!form.demandedSkills) {
      formErrors.demandedSkills = "Demanded Skills are required";
      isValid = false;
    } else {
      formErrors.demandedSkills = "";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Submitting job post", form);
      createJobPost(form)
        .then(() => toast.success("Job post created successfully!"))
        .catch(() => toast.error("Failed to create job post"));
    } else {
      toast.error("Please fix the errors before submitting.");
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: "600px", padding: "20px" }}>
      <Card.Body>
        <h2 className="mb-4">Create Job Post</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={handleChange}
              isInvalid={!!errors.jobTitle}
            />
            <Form.Control.Feedback type="invalid">{errors.jobTitle}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              isInvalid={!!errors.location}
            />
            <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="monthlySalary"
              placeholder="Monthly Salary"
              value={form.monthlySalary}
              onChange={handleChange}
              isInvalid={!!errors.monthlySalary}
            />
            <Form.Control.Feedback type="invalid">{errors.monthlySalary}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="demandedSkills"
              placeholder="Demanded Skills"
              value={form.demandedSkills}
              onChange={handleChange}
              isInvalid={!!errors.demandedSkills}
            />
            <Form.Control.Feedback type="invalid">{errors.demandedSkills}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select name="jobType" value={form.jobType} onChange={handleChange}>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select name="contractType" value={form.contractType} onChange={handleChange}>
              {contractTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Remote"
              name="remote"
              checked={form.remote}
              onChange={() => setForm({ ...form, remote: !form.remote })}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Create Job
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
