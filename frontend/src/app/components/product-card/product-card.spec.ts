import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { ProductWithPrices } from '../../shared/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: ProductWithPrices = {
    id: 1,
    name: 'Test Product',
    description: 'A test product description',
    category: 'Test Category',
    categoryId: 1,
    categoryName: 'Test Category',
    unit: 'kg',
    image: 'test-image.jpg',
    imageUrl: 'test-image.jpg',
    onSale: false,
    lowestPrice: 1.99,
    highestPrice: 2.99,
    rating: 4.5,
    ratingCount: 100,
    prices: [
      {
        supermarketId: 1,
        supermarketName: 'Test Store',
        store: 'Test Store',
        price: 1.99,
        originalPrice: 2.49,
        onSale: true,
        available: true
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant as grid', () => {
    expect(component.variant).toBe('grid');
  });

  it('should accept product input', () => {
    expect(component.product).toEqual(mockProduct);
  });

  it('should calculate best price correctly', () => {
    const bestPrice = component.bestPrice();
    expect(bestPrice).toBeTruthy();
    expect(bestPrice?.price).toBe(1.99);
    expect(bestPrice?.supermarketName).toBe('Test Store');
  });

  it('should calculate savings amount', () => {
    const savings = component.savingsAmount();
    expect(savings).toBeCloseTo(0.50, 2); // 2.49 - 1.99 = 0.50
  });

  it('should emit viewProduct when product is viewed', () => {
    const spy = vi.spyOn(component.viewProduct, 'emit');
    component.viewProduct.emit(mockProduct);
    expect(spy).toHaveBeenCalledWith(mockProduct);
  });

  it('should return null for best price when no prices available', () => {
    component.product = { ...mockProduct, prices: [] };
    fixture.detectChanges();
    expect(component.bestPrice()).toBeNull();
  });

  it('should return null for best price when no available prices', () => {
    component.product = {
      ...mockProduct,
      prices: [{ ...mockProduct.prices[0], available: false }]
    };
    fixture.detectChanges();
    expect(component.bestPrice()).toBeNull();
  });

  it('should accept comparison variant', () => {
    component.variant = 'comparison';
    fixture.detectChanges();
    expect(component.variant).toBe('comparison');
  });
});
