export interface JobPost {
    id: number,
    companyName: string,
    title: string,
    jobTitle: string,
    jobFunction: string,
    location: string,
    description: string,
    monthlySalary: number,
    demandedSkills: string,
    experienceLevel: string,
    jobType: string,
    contractType: string,
    remote: boolean,
    creationDate: Date
}