public class UpdateCategoryRequest
{
    public int CategoryId { get; set; }
    public string NewName { get; set; } = string.Empty;
    public string NewColor { get; set; } = "#FFFFFF";
    public string NewIcon { get; set; } = "default_category_url";
    public string NewType { get; set; } = "expense";
    public decimal NewLimitAmount { get; set; }    
}