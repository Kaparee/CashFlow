public class UpdateTransactionRequest
{
    public int TransactionId { get; set; }
    public int AccountId { get; set; }
    public int NewCategoryId { get; set; }
    public decimal NewAmount { get; set; }
    public string NewDescription { get; set; } = string.Empty;
    public string NewType { get; set; } = "expense";
    public DateTime NewDate { get; set; }
}