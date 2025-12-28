using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class KeyWordService : IKeyWordService
    {
        private readonly IKeyWordRepository _keyWordRepository;

        public KeyWordService(IKeyWordRepository keyWordRepository)
        {
            _keyWordRepository = keyWordRepository;
        }

        public async Task CreateNewKeyWordAsync(int userId, NewKeyWordRequest request)
        {
            if (request.Word == null)
            {
                throw new Exception("You must insert a word for KeyWord");
            }
            var isKeyWordCreated = await _keyWordRepository.IsKeyWordCreated(userId, request.Word);

            if (isKeyWordCreated == true)
            {
                throw new Exception("Given Key Word word is already created in your profile");
            }

            var newKeyWord = new KeyWord
            {
                UserId = (int)userId!,
                CategoryId = (int)request.CategoryId!,
                Word = request.Word!,
            };

            await _keyWordRepository.AddAsync(newKeyWord);
        }

    }
}