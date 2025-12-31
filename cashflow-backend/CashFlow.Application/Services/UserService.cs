using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJWTService _jwtService;
        private readonly IEmailService _emailService;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IKeyWordRepository _keyWordRepository;
        private readonly IAccountRepository _accountRepository;

        public UserService(IUserRepository userRepository, IJWTService jwtService, IEmailService emailService, ICategoryRepository categoryRepository, IKeyWordRepository keyWordRepository, IAccountRepository accountRepository)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _emailService = emailService;
            _categoryRepository = categoryRepository;
            _keyWordRepository = keyWordRepository;
            _accountRepository = accountRepository;
        }

        public async Task RegisterAsync(RegisterRequest request)
        {
            var isEmailTaken = await _userRepository.IsEmailTakenAsync(request.Email!);
            var isNicknameTaken = await _userRepository.IsNicknameTakenAsync(request.Nickname!);

            if (isEmailTaken == true || isNicknameTaken == true)
            {
                throw new Exception($"Given email or nickname is taken!");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var userGUID = Guid.NewGuid().ToString();

            var newUser = new User
            {
                FirstName = request.FirstName!,
                LastName = request.LastName!,
                Email = request.Email!,
                Nickname = request.Nickname!,
                PasswordHash = passwordHash,
                IsAdmin = false,
                IsActive = true,
                IsVerified = false,
                VerificationToken = userGUID,
                VerifiedAt = null,
            };

            

            await _userRepository.AddAsync(newUser);
            await _emailService.SendEmailAsync(request.Email!, "Welcome to CashFlow!", $"<h1>Welcome to CashFlow {request.FirstName} {request.LastName}.</h1><br>Please click the link below to activate your account!<br><a href=\"http://localhost:5205/api/verify?verificationToken={userGUID}\">VERIFY HERE</a>");
            await SeedUserDataAsync(newUser.UserId);
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetUserByEmailOrNicknameAsync(request.EmailOrNickname!);

            if (user is null) { throw new Exception("User does not exist!"); }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) { throw new Exception("Password is invalid!"); }

            if(!user.IsActive || !user.IsVerified)
            {
                throw new Exception("Account is not active or not verified.");
            }

            var token = _jwtService.GenerateToken(user);

            LoginResponse response = new LoginResponse();
            response.Token = token;

            return response;
        }

        public async Task<UserResponse> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdWithDetailsAsync(userId);

            if(user == null)
            {
                throw new Exception("User was not found");
            }

            return new UserResponse
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Nickname = user.Nickname,
                Email = user.Email,
                IsActive = user.IsActive,
                IsAdmin = user.IsAdmin,
                IsVerified = user.IsVerified,
                PhotoUrl = user.PhotoUrl,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
            };
        }

        public async Task VerifyEmailAsync(string verificationToken)
        {
            var user = await _userRepository.GetUserByVerificationTokenAsync(verificationToken);

            if (user == null)
            {
                throw new Exception("Invalid token");
            }

            user.IsVerified = true;
            user.VerifiedAt = DateTime.UtcNow;
            user.VerificationToken = null;

            await _userRepository.UpdateAsync(user);
        }

        public async Task SeedUserDataAsync(int userId)
        {
            var defaultCategories = new List<(string Name, string Icon, string Color, string Type, string[] Keywords)>
            {
                ("Jedzenie", "fastfood", "#FF5733", "expense", new[] { "Biedronka", "Lidl", "KFC", "McDonalds", "¯abka" }),
                ("Transport", "directions_car", "#33B5FF", "expense", new[] { "Shell", "Orlen", "Uber", "Bolt", "ZTM", "PKP" }),
                ("Wynagrodzenie", "payments", "#28B463", "income", new[] { "Przelew", "Salary", "Premia", "Wynagrodzenie" }),
                ("Rozrywka", "theater_comedy", "#AF7AC5", "expense", new[] { "Netflix", "Spotify", "Cinema", "Kino", "Pub" }),
                ("Zdrowie", "medical_services", "#E74C3C", "expense", new[] { "Apteka", "Dentysta", "Lekarz", "Luxmed" })
            };

            var defaultAccounts = new List<(string Name, decimal Balance, string CurrencyCode, bool IsActive, string PhotoUrl)>
            {
                ("G³ówne Konto", 0.00m, "PLN", true, "default_account_url")
            };

            foreach (var accountData in defaultAccounts)
            {
                var newAccount = new Account
                {
                    UserId = userId,
                    Name = accountData.Name,
                    Balance = accountData.Balance,
                    CurrencyCode = accountData.CurrencyCode,
                    IsActive = accountData.IsActive,
                    PhotoUrl = accountData.PhotoUrl,
                };
                await _accountRepository.AddAsync(newAccount);
            }

            foreach(var item in defaultCategories)
            {
                var category = new Category
                {
                    UserId = userId,
                    Name = item.Name,
                    Icon = item.Icon,
                    Color = item.Color,
                    Type = item.Type
                };
                await _categoryRepository.AddAsync(category);

                foreach(var word in item.Keywords)
                {
                    await _keyWordRepository.AddAsync(new KeyWord
                    {
                        UserId = userId,
                        CategoryId = category.CategoryId,
                        Word = word
                    });
                }
            }
        }
    }
}