using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;

        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<List<AccountResponse>> GetUserAccounts(int userId)
        {
            var accounts = await _accountRepository.GetUserAccountsWithDetailsAsync(userId);

            if (accounts == null || !accounts.Any())
            {
                throw new Exception("User does not have any accounts");
            }

            return accounts.Select(account => new AccountResponse
            {
                AccountId = account.AccountId!,
                Name = account.Name!,
                Balance = account.Balance!,
                CurrencyCode = account.CurrencyCode!,
                PhotoUrl = account.PhotoUrl!,
            }).ToList();
        }

        public async Task CreateNewAccountAsync(int userId, NewAccountRequest request)
        {
            var isAccountCreated = await _accountRepository.isAccountCreated(userId!, request.Name!);

            if (isAccountCreated == true)
            {
                throw new Exception("Given account name is already created in your profile");
            }

            var newAccount = new Account
            {
                UserId = userId!,
                Name = request.Name!,
                Balance = (decimal)request.Balance!,
                CurrencyCode = request.CurrencyCode!,
                PhotoUrl = request.PhotoUrl!,
                IsActive = true,
            };

            await _accountRepository.AddAsync(newAccount);
        }
    }
}