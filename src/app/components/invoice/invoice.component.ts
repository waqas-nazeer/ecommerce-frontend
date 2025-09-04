import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PassThrough } from 'stream';


interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

interface DeliveryDetails {
  name: string;
  house: string;
  // country: string;
  phone: string;
}
interface Order {
  id: number;
  totalAmount: number;
  createdAt: string;
  deliveryDetails: DeliveryDetails | string,
  items: OrderItem[];
}


@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  orderId!: string;
  order!: Order;
  loading = true;
  error: string | null = null;

  invoice = {
    number: 'J330',
    date: '02/02/2022',
    billFrom: {
      name: 'Company Name',
      address: 'Street Address, Zip Code',
      phone: 'Phone Number'
    },
    billTo: {
      name: '',
      address: '',
      phone: ''
    },
    subtotal: 0,
    discount: 0,
    tax: 0,
    paid: 0
  };
// items: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderById(Number(this.orderId)).subscribe({
      next: (data :Order) => {
        this.order = data;
             // Parse deliveryDetails if it’s a JSON string
             let details : DeliveryDetails;
             if (typeof this.order.deliveryDetails === 'string') {
              
              try {
                details = JSON.parse(this.order.deliveryDetails)
              } catch{
                details = { name: '', house: '', phone: ''}
              }
             }else {
              details = this.order.deliveryDetails;
             }
         // Map delivery details to invoice.billTo
        
        this.invoice.billTo = {
              name: details.name,
          address: `${details.house}`,
          phone: details.phone
        };

        
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load invoice';
        this.loading = false;
      }
    });
  }

  getTotal(): number {
    return this.order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  downloadInvoice(): void {
    const data = document.getElementById('invoice'); // Capture the invoice div
    if(!data) return;

    html2canvas(data).then(canvas => {
    
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0 ;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight ; 

      while (heightLeft > 0 ) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData , 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_${this.order.id}.pdf`);
    });
  }
}
