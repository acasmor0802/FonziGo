package fonzigo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
// DTO para estadisticas de productos por categoria
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStatsDTO {
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private Long productCount;
    private BigDecimal averagePrice;
    private Long onSaleCount;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

}