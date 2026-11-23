package com.valexia.ecom_backend.service;

import com.valexia.ecom_backend.model.Product;
import com.valexia.ecom_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    @Autowired
    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProduct(int id) {
        return repo.findById(id).orElse(new Product());
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    public Product updateProduct(int productId, Product product, MultipartFile imageFile) throws IOException {
        Product existingProduct = repo.findById(productId).orElse(null);
        if (existingProduct == null) {
            return null;
        }
        product.setId(productId);
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageDate(imageFile.getBytes());
        } else {
            product.setImageName(existingProduct.getImageName());
            product.setImageType(existingProduct.getImageType());
            product.setImageDate(existingProduct.getImageDate());
        }
        return repo.save(product);
    }

    public boolean deleteProduct(int id) {
        if (repo.findById(id).isPresent()) repo.deleteById(id);
        else return false;
        return true;
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}

