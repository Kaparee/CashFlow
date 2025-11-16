namespace CashFlow.Application.DTO
{
    public class AccountResponse
    {
        public int AccountId { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public string CurrencyCode { get; set; }
        public bool IsActive { get; set; }

        public CurrencyResponse Currency { get; set; }
    }
}