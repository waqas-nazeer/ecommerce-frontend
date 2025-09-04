  import { Component, OnInit } from '@angular/core';
  import { ProductService } from '../../services/product.service';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-product-stats',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-stats.component.html',
    styleUrls: ['./product-stats.component.css']
  })
  export class ProductStatsComponent implements OnInit {
  
    products : any[] = [];

    constructor(private productService: ProductService ){}

    ngOnInit(): void {
      this.loadStats();
    }

    loadStats():void {
      this.productService.getProductStats().subscribe({
        next:(res:any) => this.products = res,
        error :(err) => console.error(err)
        
      });
    }
  }
