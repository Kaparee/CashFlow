using System;

namespace CashFlow.Application.DTO.Responses
{
    public class TransactionResponse
    {
        public int TransactionId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public string? Type { get; set; }

        public ICollection<CategoryResponse> Categories { get; set; } = new List<CategoryResponse>();
    }
}