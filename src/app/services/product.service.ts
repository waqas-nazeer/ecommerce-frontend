  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { AuthService } from './auth.service';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {

    private apiUrl = 'http://localhost:3000/api/products';  // backend Api 


    constructor(private http:HttpClient,private auth :AuthService) { }

    // Add authorization header 

      private getHeaders (){
        const token = this.auth.getToken();
        return {headers: new HttpHeaders({
          Authorization : `Bearer ${token}`,
          //  'Content-Type': 'application/json'
        
        },
          
        )};
      }
      
      //Get all Products 

      getProducts(): Observable<any>{
        return this.http.get(this.apiUrl,this.getHeaders());
      }


      // get product by id

      getProductById(id: number):Observable<any>{

        return this.http.get(`${this.apiUrl}/${id}`, this.getHeaders());
      }


      //post add product 

      addProduct(product:any):Observable<any>{
    return this.http.post(this.apiUrl,product, this.getHeaders());
      }
  
      // put update product
      updateProduct(id:number, product : any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`,product, this.getHeaders());
      }

      // delete product

      deleteProduct(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders())
      }

//       updateProduct(id: number, data: FormData) {
//   return this.http.put(`http://localhost:3000/api/products/${id}`, data);
// }

// getProductById(id: number) {
//   return this.http.get(`http://localhost:3000/api/products/${id}`);
// }
    }
