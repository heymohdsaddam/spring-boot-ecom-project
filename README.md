# Valexia E-Commerce

A full-stack e-commerce learning project. A Spring Boot REST API serves product data from an in-memory H2 database, and a React (Vite) single-page app lets users browse products, manage a cart, and go through a checkout step.

## Tech Stack

**Backend (`ecom-backend`)**
- Java 25
- Spring Boot 4.2.0 (Spring Web MVC, Spring Data JPA)
- H2 in-memory database, with the H2 console
- Lombok
- Maven (wrapper included)

**Frontend (`ecom-frontend`)**
- React 18 with Vite
- React Router
- Bootstrap and React-Bootstrap
- Axios

## Project Structure

```
spring-boot-ecom-project/
├── ecom-backend/
│   └── src/main/java/com/valexia/ecom_backend/
│       ├── controller/   ProductController  – REST endpoints under /api
│       ├── service/      ProductService     – business logic
│       ├── repository/   ProductRepository  – Spring Data JPA + custom search query
│       └── model/        Product            – JPA entity (stores product image as bytes)
└── ecom-frontend/
    └── src/
        ├── components/   Home, Product, Cart, CheckoutPopup, AddProduct, UpdateProduct, Navbar
        ├── Context/      Context.jsx        – global product list and cart state
        └── axios.jsx                        – preconfigured Axios instance
```

## Features

- Browse all products on the home page, with category filtering from the navbar
- View product details, including the product image and stock availability
- Search products by name, description, brand, or category
- Add, update, and delete products, with image upload
- Shopping cart stored in `localStorage`, with quantity tracking
- Checkout summary modal showing items and total price

## Getting Started

### Prerequisites
- JDK 25
- Node.js 18+ and npm

### 1. Run the backend

```bash
cd ecom-backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`.

### 2. Run the frontend

```bash
cd ecom-frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## API Endpoints

Base path: `/api`

| Method | Endpoint                          | Description                                  |
|--------|-----------------------------------|----------------------------------------------|
| GET    | `/products`                       | List all products                            |
| GET    | `/product/{id}`                   | Get one product                              |
| POST   | `/product`                        | Add a product (multipart: `product`, `imageFile`) |
| PUT    | `/product/{productId}`            | Update a product (`imageFile` is optional)   |
| DELETE | `/product/{id}`                   | Delete a product                             |
| GET    | `/product/{productId}/image`      | Fetch a product's image bytes                |
| GET    | `/products/search?name=keyword`   | Search products by keyword                   |

## Database Access

With the app running, the H2 console is available at `http://localhost:8080/h2-console`.

- JDBC URL: `jdbc:h2:mem:valexia`
- Username: `sa`
- Password: *(leave empty)*

Note that the database is in memory, so all data resets when the backend restarts.

## Configuration

Settings live in `ecom-backend/src/main/resources/application.properties`:

- `spring.jpa.hibernate.ddl-auto=update`: the schema is generated from the entity.
- `spring.jpa.show-sql=true`: SQL is printed to the console.
- Upload limit: 10 MB per file and per request.

The frontend points at `http://localhost:8080/api` in `src/axios.jsx`.

## Roadmap

- [ ] Real checkout flow with an order API
- [ ] Persist data in a real database (e.g. PostgreSQL or MySQL)
- [ ] User authentication and authorization
- [ ] Stock decrement on purchase
- [ ] Input validation and proper error responses
- [ ] Unit and integration tests

## Known Limitations

- Data is lost on every backend restart (in-memory H2).
- Product images are stored in the database as bytes, which does not scale well.
- Checkout only displays the order summary; it does not place an order.
- API URLs are hardcoded to `localhost`.
- CORS is open for all origins.

## Author

Valexia
