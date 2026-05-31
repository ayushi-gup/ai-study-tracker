from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import re
import os
import anthropic
import json
import tempfile

app = Flask(__name__)
CORS(app)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))

SKILL_CATEGORIES = {
    "Frontend": [
        "react", "vue", "angular", "svelte", "next.js", "nuxt", "html", "css",
        "sass", "scss", "tailwind", "bootstrap", "javascript", "typescript",
        "redux", "zustand", "webpack", "vite", "graphql", "rest api",
    ],
    "Backend": [
        "node.js", "express", "django", "flask", "fastapi", "spring boot",
        "laravel", "rails", "asp.net", "go", "rust", "java", "python",
        "php", "c#", "kotlin", "scala", "microservices", "websockets",
    ],
    "Database": [
        "postgresql", "mysql", "mongodb", "redis", "sqlite", "cassandra",
        "elasticsearch", "dynamodb", "firebase", "supabase", "prisma",
        "sequelize", "sqlalchemy", "orm",
    ],
    "DevOps & Cloud": [
        "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "jenkins",
        "github actions", "terraform", "ansible", "nginx", "linux", "bash",
        "prometheus", "grafana", "datadog",
    ],
    "Data & ML": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "matplotlib", "jupyter", "sql",
        "spark", "hadoop", "airflow", "dbt", "tableau", "power bi",
    ],
    "Mobile": [
        "react native", "flutter", "swift", "kotlin", "ios", "android",
        "expo", "xcode", "jetpack compose",
    ],
    "Tools & Practices": [
        "git", "github", "jira", "agile", "scrum", "tdd", "bdd",
        "unit testing", "jest", "pytest", "selenium", "figma", "postman",
        "swagger", "oauth", "jwt", "rest", "graphql",
    ],
}

ALL_SKILLS = [s for skills in SKILL_CATEGORIES.values() for s in skills]


def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def detect_skills(text):
    text_lower = text.lower()
    detected = []
    missing = []
    for skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            detected.append(skill)
        else:
            missing.append(skill)
    return {"detected": detected, "missing": missing}


def compute_base_score(detected, text):
    skill_score = min(len(detected) * 3, 45)
    word_count = len(text.split())
    length_score = min(word_count // 40, 20)
    has_bullets = 10 if ("•" in text or "-" in text or "*" in text) else 0
    has_links = 5 if ("github" in text.lower() or "linkedin" in text.lower()) else 0
    has_education = 10 if any(w in text.lower() for w in ["bachelor", "master", "b.tech", "b.e", "degree", "university", "college"]) else 0
    has_experience = 10 if any(w in text.lower() for w in ["experience", "worked", "developed", "built", "designed", "led"]) else 0
    total = skill_score + length_score + has_bullets + has_links + has_education + has_experience
    return min(int(total), 100)


def ai_analysis(resume_text, job_description, detected_skills, missing_skills):
    top_missing = missing_skills[:30]
    prompt = f"""You are an expert technical recruiter and resume coach.

Resume text:
\"\"\"
{resume_text[:5000]}
\"\"\"

{"Target job / role description:" + job_description if job_description else ""}

Already detected skills: {", ".join(detected_skills[:40]) if detected_skills else "none"}
Skills NOT found in resume: {", ".join(top_missing) if top_missing else "none"}

Respond with ONLY valid JSON (no markdown, no explanation) in this exact structure:
{{
  "score_adjustment": <integer -10 to +10>,
  "verdict": "<5 words max>",
  "strengths": ["<sentence 1>", "<sentence 2>", "<sentence 3>"],
  "priority_missing_skills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
  "gaps": [
    {{"skill": "<name>", "why": "<1 sentence>", "how": "<1 sentence>"}},
    {{"skill": "<name>", "why": "<1 sentence>", "how": "<1 sentence>"}},
    {{"skill": "<name>", "why": "<1 sentence>", "how": "<1 sentence>"}}
  ],
  "summary": "<3-4 honest sentences about this resume>"
}}"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = message.content[0].text
    clean = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/analyze", methods=["POST"])
def analyze():
    if "resume" not in request.files:
        return jsonify({"error": "No resume file uploaded"}), 400

    resume_file = request.files["resume"]
    job_description = request.form.get("job_description", "")

    if resume_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    ext = os.path.splitext(resume_file.filename)[1].lower()
    if ext not in {".pdf", ".txt"}:
        return jsonify({"error": "Only PDF and TXT files are supported"}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        resume_file.save(tmp.name)
        tmp_path = tmp.name

    try:
        if ext == ".pdf":
            resume_text = extract_text_from_pdf(tmp_path)
        else:
            with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
                resume_text = f.read()

        if not resume_text.strip():
            return jsonify({"error": "Could not extract text. Make sure the PDF is not image-only."}), 400

        skills = detect_skills(resume_text)
        detected = skills["detected"]
        missing = skills["missing"]
        base_score = compute_base_score(detected, resume_text)
        ai_result = ai_analysis(resume_text, job_description, detected, missing)
        final_score = max(0, min(100, base_score + ai_result.get("score_adjustment", 0)))

        return jsonify({
            "score": final_score,
            "verdict": ai_result.get("verdict", ""),
            "detected_skills": detected,
            "missing_skills": ai_result.get("priority_missing_skills", missing[:10]),
            "strengths": ai_result.get("strengths", []),
            "gaps": ai_result.get("gaps", []),
            "summary": ai_result.get("summary", ""),
            "skill_count": len(detected),
            "word_count": len(resume_text.split()),
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    