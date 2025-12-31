public class UpdateAccountRequest
{
    public int AccountId { get; set; }
    public string NewName { get; set; } = string.Empty;
    public string NewPhotoUrl { get; set; } = "default_account_url";
}