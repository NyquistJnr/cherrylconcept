const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value) {
      query.append(key, String(value));
    }
  }

  const url = `${API_BASE_URL}/products/?${query.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], count: 0 };
  }
}

export async function fetchCategories() {
  const url = `${API_BASE_URL}/products/categories/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] };
  }
}
