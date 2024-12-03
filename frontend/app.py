import streamlit as st
import requests
import os

# Backend API URL
BASE_URL = os.environ['BASE_URL']

# Initialize session state
if "jwt_token" not in st.session_state:
    st.session_state.jwt_token = None
if "user_role" not in st.session_state:
    st.session_state.user_role = None

# Helper Function: Make Authenticated API Requests
def api_request(method, endpoint, data=None, params=None):
    headers = {"Authorization": f"Bearer {st.session_state.jwt_token}"} if st.session_state.jwt_token else {}
    csrf=requests.get(os.environ['CSRF_URL'], headers=headers, params=params).cookies.get('csrf-token')
    print(csrf)
    headers['CSRF-Token']=csrf
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data)
        else:
            st.error("Invalid HTTP method")
            return None
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {e}")
        return None

# User Authentication
def login():
    st.title("Login")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        response = api_request("POST", "/auth/login", data={"email": email, "password": password})
        if response:
            st.session_state.jwt_token = response["token"]
            st.session_state.user_role = response["role"]
            st.success(f"Logged in as {st.session_state.user_role.capitalize()}")

def register():
    st.title("Register")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    role = st.selectbox("Role", ["developer", "reviewer", "admin"])
    organization = st.text_input("Organization")
    if st.button("Register"):
        response = api_request("POST", "/auth/register", data={"email": email, "password": password, "role": role, "organization": organization})
        if response:
            st.success("Registration successful. Please log in.")

# Admin Dashboard
def admin_dashboard():
    st.title("Admin Dashboard")
    if st.button("Create Workspace"):
        name = st.text_input("Workspace Name")
        if st.button("Submit"):
            response = api_request("POST", "/workspaces", data={"name": name})
            if response:
                st.success("Workspace created successfully.")
    
    workspaces = api_request("GET", "/workspaces")
    if workspaces:
        st.write("Available Workspaces:")
        for ws in workspaces:
            st.write(f"- {ws['name']} (ID: {ws['_id']})")

# Developer Dashboard
def developer_dashboard():
    st.title("Developer Dashboard")
    workspace_id = st.text_input("Workspace ID")
    code = st.text_area("Code Snippet")
    if st.button("Upload Snippet"):
        response = api_request("POST", "/snippets", data={"workspaceId": workspace_id, "code": code})
        if response:
            st.success("Snippet uploaded successfully.")
    
    if st.button("View Snippets"):
        snippets = api_request("GET", f"/snippets/{workspace_id}")
        if snippets:
            for snip in snippets:
                st.write(f"Snippet ID: {snip['_id']}")
                st.code(snip["code"])

# Reviewer Dashboard
def reviewer_dashboard():
    st.title("Reviewer Dashboard")
    workspace_id = st.text_input("Workspace ID")
    if st.button("View Snippets"):
        snippets = api_request("GET", f"/snippets/{workspace_id}")
        if snippets:
            for snip in snippets:
                st.write(f"Snippet ID: {snip['_id']}")
                st.code(snip["code"])
                comment = st.text_input(f"Comment for Snippet {snip['_id']}")
                if st.button(f"Submit Comment for Snippet {snip['_id']}"):
                    response = api_request("POST", f"/reviews/{snip['_id']}", data={"comments": [{"line": 1, "text": comment}]})
                    if response:
                        st.success(f"Comment added to Snippet {snip['_id']}")
                status = st.selectbox(f"Status for Snippet {snip['_id']}", ["approved", "rejected"])
                if st.button(f"Update Status for Snippet {snip['_id']}"):
                    response = api_request("PATCH", f"/reviews/{snip['_id']}/status", data={"status": status})
                    if response:
                        st.success(f"Snippet {snip['_id']} marked as {status}.")

# Main App Logic
if st.session_state.jwt_token:
    if st.session_state.user_role == "admin":
        admin_dashboard()
    elif st.session_state.user_role == "developer":
        developer_dashboard()
    elif st.session_state.user_role == "reviewer":
        reviewer_dashboard()
    else:
        st.error("Unknown role.")
else:
    mode = st.sidebar.selectbox("Mode", ["Login", "Register"])
    if mode == "Login":
        login()
    elif mode == "Register":
        register()
