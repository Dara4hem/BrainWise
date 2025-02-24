import requests
import os

GITHUB_REPO = "Dara4hem/BrainWise"
GITHUB_ACCESS_TOKEN = "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"

README_PATH = "../README.md"

def read_local_readme():
    """Reads the local README.md file and returns its content."""
    if os.path.exists(README_PATH):
        with open(README_PATH, "r", encoding="utf-8") as file:
            return file.read()
    return None

def search_in_readme(query):
    """Searches for relevant information in the local README.md file."""
    content = read_local_readme()
    if content and query.lower() in content.lower():
        return "🔍 Found in README:\n" + extract_relevant_section(content, query)
    return None

def extract_relevant_section(content, query):
    """Extracts the most relevant section from the README file."""
    lines = content.split("\n")
    for i, line in enumerate(lines):
        if query.lower() in line.lower():
            return "\n".join(lines[max(0, i - 3): min(len(lines), i + 5)])
    return "No detailed answer found in README."

def fetch_from_github(file_path):
    """Fetches the content of a file from GitHub repository."""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{file_path}"
    headers = {"Authorization": f"token {GITHUB_ACCESS_TOKEN}"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return requests.get(response.json()["download_url"]).text
    except Exception as e:
        print(f"Error fetching from GitHub: {e}")
        return None

def chatbot(query):
    """Main chatbot function."""
    readme_response = search_in_readme(query)
    if readme_response:
        return readme_response
    
    file_paths = ["employee_management/README.md", "employee_management_frontend/README.md"]
    for file_path in file_paths:
        content = fetch_from_github(file_path)
        if content and query.lower() in content.lower():
            return f"🔍 Found in GitHub file `{file_path}`:\n" + extract_relevant_section(content, query)

    return "❌ No answer found in README or GitHub. Please provide more details."

if __name__ == "__main__":
    query = input("Ask something about the project: ")
    print(chatbot(query))
