namespace CashFlow.Application.Interfaces
{
	public interface ICurrencyService
	{
		Task SyncRatesAsync();
	}
}