namespace CashFlow.Application.DTO
{
    public class UserResponse
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string? PhotoUrl { get; set; }

        public bool IsActive { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsVerified { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<AccountResponse> Accounts { get; set; } = new List<AccountResponse>();

        public ICollection<CategoryResponse> Categories { get; set; } = new List<CategoryResponse>();

        public ICollection<TransactionResponse> Transactions { get; set; } = new List<TransactionResponse>();

        public ICollection<RecTransactionResponse> RecTransactions { get; set; } = new List<RecTransactionResponse>();

        public ICollection<NotificationResponse> Notifications { get; set; } = new List<NotificationResponse>();

        public ICollection<KeyWordResponse> KeyWords { get; set; } = new List<KeyWordResponse>();
    }
}