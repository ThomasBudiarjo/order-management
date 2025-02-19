# Order Management System

A React-based order management system using PocketBase as the backend.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_POCKETBASE_URL=your_pocketbase_url
VITE_ORDER_LIST_PATH=/order (can be anything)
VITE_MENU_IMAGE_URL=your_menu_image_url
```

## Database Structure

### Orders Collection

Create a collection named `orders` with the following fields:

| Field Name | Type | Required | Description              |
| ---------- | ---- | -------- | ------------------------ |
| name       | text | Yes      | Customer name            |
| number     | text | No       | Contact number           |
| items      | json | Yes      | Array of order items     |
| created    | date | Yes      | Order creation timestamp |
| updated    | date | Yes      | Order update timestamp   |

#### Items JSON Structure

The `items` field should contain an array of objects with the following structure:

```json
  "items": [
    {
      "item": "item name",
      "status": "pending"
    },
    {
      "item": "item name",
      "status": "done"
    }
  ]
}
```

Status can be one of: "pending", "done"

## Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```
# order-management
