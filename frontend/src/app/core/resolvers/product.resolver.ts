import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProductService, Product, ProductsResponse } from '../services/product.service';
import { catchError, of, map } from 'rxjs';

export const productResolver: ResolveFn<Product | null> = (route) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return productService.getProductById(Number(id)).pipe(
    catchError(() => {
      router.navigate(['/productos'], {
        state: { error: `No existe el producto con id ${id}` }
      });
      return of(null);
    })
  );
};

export const productsResolver: ResolveFn<Product[]> = () => {
  const productService = inject(ProductService);
  
  return productService.loadProducts().pipe(
    map((response: ProductsResponse) => response.content),
    catchError(() => of([]))
  );
};
