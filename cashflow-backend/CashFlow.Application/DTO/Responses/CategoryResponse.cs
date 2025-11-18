namespace CashFlow.Application.DTO.Responses
{
    public class CategoryResponse
    {
        public int CategoryId { get; set; }
        public required string Name { get; set; }
        public string? Color { get; set; }
        public required string Type { get; set; }
        public decimal? LimitAmount { get; set; }

        public ICollection<KeyWordResponse> KeyWords { get; set; } = new List<KeyWordResponse>();
    }
}