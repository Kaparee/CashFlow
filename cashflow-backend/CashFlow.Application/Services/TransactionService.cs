using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
    

        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task CreateNewTransactionAsync(int userId, NewTransactionRequest request)
        {
            if (request.Amount <= 0 || request.Amount == null)
            {
                throw new Exception("Transaction must be greater than 0");
            }
            if (request.AccountId == null)
            {
                throw new Exception("AccountId is required to create a transaction");
            }
            if (request.CategoryId == null)
            {
                throw new Exception("CategoryId is required to create a transaction");
			}

            var newTransaction = new Transaction
            {
                UserId = userId!,
                AccountId = (int)request.AccountId!,
                CategoryId = (int)request.CategoryId!,
                Amount = (decimal)request.Amount!,
                Description = request.Description!,
                Type = request.Type!
            };

			await _transactionRepository.AddAsync(newTransaction);

		}

	}
}