// Supabase API service
export const todoAPI = {
  // Supabase configuration from environment variables
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  get API_BASE() {
    return `${this.SUPABASE_URL}/rest/v1`;
  },

  // Headers for Supabase API calls
  getHeaders() {
    return {
      'apikey': this.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  },

  // Check if Supabase is configured
  isConfigured() {
    return this.SUPABASE_URL && this.SUPABASE_ANON_KEY;
  },

  // Fetch all todos
  async fetchTodos() {
    if (!this.isConfigured()) return [];
    
    const response = await fetch(`${this.API_BASE}/todos?select=*&order=created_at.desc`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Create a new todo
  async createTodo(todo) {
    if (!this.isConfigured()) return null;
    
    const response = await fetch(`${this.API_BASE}/todos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(todo)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0];
  },

  // Update an existing todo
  async updateTodo(id, updates) {
    if (!this.isConfigured()) return null;
    
    const response = await fetch(`${this.API_BASE}/todos?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0];
  },

  // Delete a todo
  async deleteTodo(id) {
    if (!this.isConfigured()) return;
    
    const response = await fetch(`${this.API_BASE}/todos?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
};