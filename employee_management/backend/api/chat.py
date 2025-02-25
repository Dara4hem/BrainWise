import os
import requests
import langdetect
import PyPDF2
from dotenv import load_dotenv

load_dotenv()

GITHUB_REPO = "Dara4hem/BrainWise"
GITHUB_API_BASE = f"https://api.github.com/repos/{GITHUB_REPO}/contents"
GITHUB_ACCESS_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN", )

MISTRAL_API_KEY = "Xn6Q7lyZ80S5LHGb9Wojma1OH9XHmXki"
MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"

def parse_pdf(pdf_path: str) -> str:
    """
    Reads text from a PDF file using PyPDF2 and returns it as a string.
    """
    text = ""
    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except:
        text = f"Error reading PDF file at {pdf_path}."
    return text

def load_local_documentation():
    """
    Reads two PDF files from 'documentation/' folder:
    'backend.pdf' and 'frontend.pdf'.
    Returns their text as strings.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    doc_dir = os.path.join(current_dir, "documentation")

    backend_pdf_path = os.path.join(doc_dir, "backend.pdf")
    frontend_pdf_path = os.path.join(doc_dir, "frontend.pdf")

    backend_text = parse_pdf(backend_pdf_path)
    frontend_text = parse_pdf(frontend_pdf_path)

    return backend_text, frontend_text

DOC_BACKEND, DOC_FRONTEND = load_local_documentation()

print("DEBUG: Length of DOC_BACKEND:", len(DOC_BACKEND))
print("DEBUG: First 200 chars of DOC_BACKEND:", DOC_BACKEND[:200])
print("DEBUG: Length of DOC_FRONTEND:", len(DOC_FRONTEND))
print("DEBUG: First 200 chars of DOC_FRONTEND:", DOC_FRONTEND[:200])

def fetch_readme_from_github():
    try:
        url = "https://raw.githubusercontent.com/Dara4hem/BrainWise/main/README.md"
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        return f"❌ ERROR: Could not fetch README.md from GitHub. Details: {e}"

README_CONTENT = fetch_readme_from_github()

def fetch_file_from_github(file_path):
    url = f"{GITHUB_API_BASE}/{file_path}"
    headers = {"Authorization": f"token {GITHUB_ACCESS_TOKEN}"}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 401:
            return "❌ ERROR: Unauthorized. Check your GitHub Access Token."
        elif response.status_code == 404:
            return "❌ ERROR: File not found."
        response.raise_for_status()
        data = response.json()
        if "download_url" in data:
            file_content = requests.get(data["download_url"]).text
            return file_content
        else:
            return "❌ ERROR: No download URL found."
    except requests.exceptions.RequestException as e:
        return f"❌ ERROR: Could not fetch the file from GitHub. Details: {e}"

def extract_relevant_code(full_code, query):
    query_keywords = {
        "تسجيل المستخدمين": ["register", "signup", "create user", "registration"],
        "تسجيل الدخول": ["login", "authenticate", "token"],
        "إدارة الموظفين": ["employee", "staff", "worker"],
        "إدارة الشركات": ["company", "organization"],
        "إدارة الأقسام": ["department", "division"],
    }
    selected_keywords = []
    for key, keywords in query_keywords.items():
        if key in query:
            selected_keywords = keywords
            break

    if not selected_keywords:
        return full_code

    extracted_lines = []
    lines = full_code.split("\n")
    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in selected_keywords):
            start = max(0, i - 3)
            end = min(len(lines), i + 5)
            extracted_lines.extend(lines[start:end])
            extracted_lines.append("\n" + "-" * 50 + "\n")
    return "\n".join(extracted_lines) if extracted_lines else full_code

def query_mistral_ai(prompt, language="en"):
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }
    system_message = f"""
    You are an AI assistant that should answer based only on the given README.md file.
    Do not use external knowledge. Use the following README content:
    
    {README_CONTENT}
    
    Always answer in the same language as the user question.
    """
    data = {
        "model": "mistral-large-latest",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt},
        ],
    }
    try:
        resp = requests.post(MISTRAL_ENDPOINT, json=data, headers=headers)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"❌ AI Error: {e}"

def detect_language(text):
    try:
        return langdetect.detect(text)
    except:
        return "en"

def chatbot(query):
    language = detect_language(query.lower())

    # 1) If user specifically asks for "backend doc" or "frontend doc", return PDF text
    if "backend doc" in query.lower() or "باك اند" in query.lower():
        return f"Here is the backend documentation:\n{DOC_BACKEND}"

    if "frontend doc" in query.lower() or "فرونت اند" in query.lower():
        return f"Here is the frontend documentation:\n{DOC_FRONTEND}"

    # 2) If user asks for code
    if "كود" in query or "code" in query or "api" in query.lower():
        if "الموظفين" in query.lower() or "employees" in query.lower():
            related_code_file = "employee_management/backend/api/views.py"
        elif "المستخدمين" in query.lower() or "users" in query.lower():
            related_code_file = "employee_management/backend/api/views.py"
        elif "التسجيل" in query.lower() or "authentication" in query.lower():
            related_code_file = "employee_management/backend/api/serializers.py"
        else:
            related_code_file = None

        if related_code_file:
            full_code = fetch_file_from_github(related_code_file)
            if "❌ ERROR" in full_code:
                return full_code
            relevant_code = extract_relevant_code(full_code, query.lower())
            return f"📜 **الكود ذو الصلة بـ `{query}`:**\n\n```python\n{relevant_code}\n```"

    # 3) Otherwise, fallback to Mistral AI with README
    return query_mistral_ai(query, language)

if __name__ == "__main__":
    print("✅ README successfully fetched from GitHub!")
    print("🔍 Loading local PDF documentation...")
    print("DEBUG: Length of DOC_BACKEND:", len(DOC_BACKEND))
    print("DEBUG: First 200 chars of DOC_BACKEND:", DOC_BACKEND[:200])
    print("DEBUG: Length of DOC_FRONTEND:", len(DOC_FRONTEND))
    print("DEBUG: First 200 chars of DOC_FRONTEND:", DOC_FRONTEND[:200])

    while True:
        query = input("\n💬 Ask about the project (or type 'exit' to quit): ")
        if query.lower() == "exit":
            break
        answer = chatbot(query)
        print("\n🤖 Bot:", answer)
