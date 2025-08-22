import { Component } from '@angular/core';
import { Validators, FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;

   productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    stock: [0]
  });

  constructor(
    private fb: FormBuilder,
     private router:Router, private productService: ProductService,
      private toast: ToastService) {}
      onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
      
        // preview image
        if (this.selectedFile) {
          const reader = new FileReader();
          reader.onload = () => (this.previewUrl = reader.result as string);
          reader.readAsDataURL(this.selectedFile);
        }
      }

      addProduct() {
        if (this.productForm.valid) {
          const formData = new FormData();
          formData.append('name', this.productForm.value.name!);
    formData.append('description', this.productForm.value.description || '');
    formData.append('price', (this.productForm.value.price ?? 0).toString());
    formData.append('stock', (this.productForm.value.stock ?? 0).toString());
          if (this.selectedFile) {
            formData.append("image", this.selectedFile);
          }
      
          this.productService.addProduct(formData).subscribe({
            next: () => {
              this.toast.success("Product added successfully");
              this.router.navigate(["/products"]);
            },
            error: (err) =>
              this.toast.error(err.error.message || "Failed to add product"),
          });
        }
      }

  
}
