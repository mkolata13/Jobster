import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { createJobPost } from "../api/jobPosts";
import { ExperienceLevel } from "../enums/ExperienceLevel";
import { JobType } from "../enums/JobType";
import { ContractType } from "../enums/ContractType";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting job post", form);
    createJobPost(form);
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: "600px", padding: "20px" }}>
      <Card.Body>
        <h2 className="mb-4">Create Job Post</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="text" name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="text" name="jobFunction" placeholder="Job Function" value={form.jobFunction} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control as="textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="number" name="monthlySalary" placeholder="Monthly Salary" value={form.monthlySalary} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="text" name="demandedSkills" placeholder="Demanded Skills" value={form.demandedSkills} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
              {experienceLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Select name="jobType" value={form.jobType} onChange={handleChange}>
              {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Select name="contractType" value={form.contractType} onChange={handleChange}>
              {contractTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Remote" name="remote" checked={form.remote} onChange={() => setForm({ ...form, remote: !form.remote })} />
          </Form.Group>
          <Button type="submit" variant="primary">Create Job</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
