const API_URL = "http://localhost:8081/api";

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
  });
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}