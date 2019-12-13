using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;

namespace SecurityCourse.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ILogger<AccountController> _logger;
        private readonly IMongoDatabase _mongoDatabase;
        private readonly IMongoCollection<Account> _accounts;

        public AccountController(ILogger<AccountController> logger)
        {
            _logger = logger;
            _mongoDatabase = new MongoClient("mongodb://localhost").GetDatabase("SecuredDatabase");
            _accounts = _mongoDatabase.GetCollection<Account>("Accounts");

            if (!_accounts.AsQueryable().Any())
            {
                _accounts.InsertOne(new Account {Login = "root", Password = "hard_password"});
            }
        }

        [HttpPost("[action]")]
        public AuthResponse Login([FromBody] AuthRequest request)
        {
            var document = BsonDocument.Parse($@"{{
                                                     Login : ""{request.Login}"" , Password: /{request.Password}/i
                                                }}");

            var accountFound = _accounts.Find(document).Any();

            return new AuthResponse
            {
                IsAuthorized = accountFound
            };
        }
    }

    public class Account
    {
        [BsonId(IdGenerator = typeof(ObjectIdGenerator))]
        public object Id { get; set; }

        public string Login { get; set; }
        public string Password { get; set; }
    }

    public class AuthResponse
    {
        public bool IsAuthorized { get; set; }
    }

    public class AuthRequest
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}
