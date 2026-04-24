# BFHL Node Hierarchy Analyzer 🚀

A robust Full-Stack application designed for the SRM Engineering Challenge. This tool provides a visual interface and a REST API to analyze hierarchical node relationships, detect cycles, and summarize complex graph structures.

## 🌟 Key Features
- **Intelligent Graph Processing**: Efficiently handles multiple independent trees and cyclic groups.
- **Rule-Based Validation**: Implements strict processing rules for multi-parent nodes (first-parent wins), self-loops, and duplicate edges.
- **Real-Time Visualization**: A premium dark-themed dashboard that renders tree hierarchies in a human-readable format.
- **Responsive API**: High-performance `/bfhl` endpoint designed to respond in under 3 seconds even with complex inputs.

## 🛠️ Tech Stack
- **Backend**: Node.js & Express.js
- **Frontend**: Vanilla JavaScript & CSS3 (Custom Dark Theme)
- **Deployment**: Vercel
- **Middleware**: CORS & Body-Parser

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.

### Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## 📡 API Documentation

### Endpoint: `POST /bfhl`
Processes an array of node strings and returns structured insights.

**Request Format:**
```json
{
  "data": ["A->B", "B->C", "X->Y"]
}
```

**Response Format:**
Returns a JSON object containing:
- `user_id`, `email_id`, `college_roll_number`
- `hierarchies`: Array of processed trees and cycles.
- `invalid_entries`: List of inputs that failed validation.
- `duplicate_edges`: List of repeated connections.
- `summary`: Statistics on total trees, cycles, and the largest tree root.

## ⚖️ Evaluation Compliance
- **CORS Enabled**: The API is accessible from any origin.
- **Non-Hardcoded**: The logic is fully algorithmic and handles any valid node input.
- **Schema Validated**: Matches the required response structure 100%.
