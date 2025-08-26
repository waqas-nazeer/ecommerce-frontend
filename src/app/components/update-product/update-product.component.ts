import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  currentImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Get product ID from route
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product: any) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock
        });
        this.currentImage = product.imageUrl ? `http://localhost:3000${product.imageUrl}` : null;
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to load product')
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  updateProduct() {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('stock', this.productForm.value.stock);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (res) => {
        this.toast.success('Product updated successfully');
        this.router.navigate(['/products']);
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to update product')
    });
  }
}
