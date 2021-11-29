const express = require("express");

const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/naukri");
}

// 1. Create city schema

const citySchema = new mongoose.Schema({
    city_name: { type: String, required: true }
}, {
    versionKey: false,
    timestamps: true
});
// 1. city model
const City = mongoose.model("city", citySchema);

// 2. create company schema

const companySchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    details: { type: String, required: false },
    city_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "city",
        required: true
    }

}, {
    versionKey: false,
    timestamps: true
});

//  2. comapany model

const Company = mongoose.model("company", companySchema);

// 3. Create Skills schema

const skillSchema = new mongoose.Schema({
    skill: { type: String, required: true }
}, {
    versionKey: false,
    timestamps: true
});
// 3. skill model
const Skill = mongoose.model("skill", skillSchema);

// 4. Create Job schema

const jobSchema = new mongoose.Schema({
    job_title: { type: String, required: true },
    job_type: { type: String, required: true, default: "Ragular" },
    rating: { type: Number, required: true },
    posting_date: { type: Date, required: true },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
        required: true
    },
    skill_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skill",
        required: true
    },
    city_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "city",
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});
// 4. skill model
const Job = mongoose.model("job", jobSchema);

// create controllers 
// get and post city

app.get("/city", async(req, res) => {
    try {
        const cities = await City.find().lean().exec();
        res.send(cities);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.post("/city", async(req, res) => {
    try {
        const addCity = await City.create(req.body);
        res.status(201).send(addCity);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// get and post company

app.get("/company", async(req, res) => {
    try {
        const companies = await Company.find().populate("city_id").lean().exec();
        res.send(companies);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.post("/company", async(req, res) => {
    try {
        const addCompany = await Company.create(req.body);
        res.status(201).send(addCompany);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// get and post controllers of skills
app.get("/skill", async(req, res) => {
    try {
        const skills = await Skill.find().lean().exec();
        res.send(skills);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.post("/skill", async(req, res) => {
    try {
        const addSkill = await Skill.create(req.body);
        res.status(201).send(addSkill);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// get and post controllers of job

app.get("/job", async(req, res) => {
    try {
        const allJobs = await Job.find().lean().exec();
        res.send(allJobs);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.post("/job", async(req, res) => {
    try {
        const addJob = await Job.create(req.body);
        res.status(201).send(addJob);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// -------------------- Other CRUD APIs-------------------------------

// get all jobs in a particular city which matches a particular skill
app.get("/job/city_id=:city_id/skill_id=:skill_id", async(req, res) => {
    try {
        const allJobs = await Job.find({ $and: [{ city_id: req.params.city_id }, { skill_id: req.params.skill_id }] })
            .populate({ path: "company", select: "company_name" })
            .populate({ path: "skill_id", select: "skill" })
            .populate({ path: "city_id", select: "city_name" })
            .lean().exec();
        res.send(allJobs);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// find all the jobs that are available as Work from home

app.get("/job/wfh", async(req, res) => {
    try {
        const allJobs = await Job.find({ job_type: { $eq: "Work from home" } })
            .populate({ path: "company", select: "company_name" })
            .populate({ path: "skill_id", select: "skill" })
            .populate({ path: "city_id", select: "city_name" })
            .lean().exec();
        res.send(allJobs);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// find all jobs by sorting the jobs as per their rating.

app.get("/job/rating", async(req, res) => {
    try {
        const allJobs = await Job.find().sort({ rating: -1 })
            .populate({ path: "company", select: "company_name" })
            .populate({ path: "skill_id", select: "skill" })
            .populate({ path: "city_id", select: "city_name" })
            .lean().exec();
        res.send(allJobs);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// an api to get details of the company

app.get("/company_id=:id/details", async(req, res) => {
    try {
        const details = await Company.findById(req.params.id)
            .populate({ path: "city_id", select: "city_name" })
            .lean().exec();
        res.send(details.details);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// find the company that has the most open jobs.

app.get("/company/mostjobs", async(req, res) => {
    try {
        const details = await Company.find().sort({ rating: -1 }).limit(1)
            .populate({ path: "city_id", select: "city_name" })
            .lean().exec();

        res.send(details);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// --------------------listening part----------------------------

app.listen(3001, async() => {
    await connect();
    console.log("Listening on port : 3001");
})