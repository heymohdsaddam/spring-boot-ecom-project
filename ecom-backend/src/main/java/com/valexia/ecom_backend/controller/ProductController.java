package com.valexia.ecom_backend.controller;

import com.valexia.ecom_backend.model.Product;
import com.valexia.ecom_backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;


    @Autowired
    public ProductController(ProductService service) {

        this.service = service;

    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        return ResponseEntity.of(Optional.ofNullable(service.getProduct(id)));
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart("product") Product product, @RequestPart("imageFile") MultipartFile imageFile) {
        try {
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getLocalizedMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId) {
        Product product = service.getProduct(productId);
        byte[] imageFile = product.getImageDate();
        return ResponseEntity.ok().contentType(MediaType.valueOf(product.getImageType())).body(imageFile);

    }

    @PutMapping("/product/{productId}")
    public ResponseEntity<String> updateProduct(@PathVariable int productId, @RequestPart("product") Product product, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        Product outProduct;
        try {
            outProduct = service.updateProduct(productId, product, imageFile);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
        }
        if (outProduct != null) return ResponseEntity.ok("updated");
        else return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProductById(@PathVariable int id) {
        if (service.deleteProduct(id)) return ResponseEntity.ok("Deleted Successfully");
        else return new ResponseEntity<>("product not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("name") String keyword) {
        List<Product> searchProduct = service.searchProducts(keyword);
        return ResponseEntity.ok(searchProduct);
    }
}
