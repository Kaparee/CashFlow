using CashFlow.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Principal;

namespace CashFlow.Infrastructure.Data
{
    public class CashFlowDbContext : DbContext
    {
        public CashFlowDbContext(DbContextOptions<CashFlowDbContext> options)
            : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Limit> Limits { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<RecTransaction> Rec_Transactions { get; set; }
        public DbSet<KeyWord> Key_Words { get; set; }
        public DbSet<Notification> Notifications { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Currency>().ToTable("currencies");

            modelBuilder.Entity<Account>().ToTable("accounts");

            modelBuilder.Entity<Category>().ToTable("categories");

            modelBuilder.Entity<Limit>().ToTable("limits");

            modelBuilder.Entity<Transaction>().ToTable("transactions");

            modelBuilder.Entity<RecTransaction>().ToTable("rec_transactions");

            modelBuilder.Entity<KeyWord>().ToTable("key_words");
            modelBuilder.Entity<KeyWord>()
            .HasIndex(k => new { k.UserId, k.Word })
            .IsUnique();

            modelBuilder.Entity<Notification>().ToTable("notifications");

            modelBuilder.Entity<Category>()
                .HasOne(c => c.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .IsRequired(false);


            modelBuilder.Entity<KeyWord>()
                .HasOne(k => k.Category)
                .WithMany(c => c.KeyWords)
                .HasForeignKey(k => k.CategoryId)
                .IsRequired();

            modelBuilder.Entity<Account>()
                .HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.UserId)
                .IsRequired();

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Currency)
                .WithMany(c => c.Accounts)
                .HasForeignKey(a => a.CurrencyCode)
                .IsRequired();

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CategoryId)
                .IsRequired(false);

            modelBuilder.Entity<RecTransaction>()
                .HasOne(rt => rt.Category)
                .WithMany(c => c.RecTransactions)
                .HasForeignKey(rt => rt.CategoryId)
                .IsRequired();
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .IsRequired(false);

            base.OnModelCreating(modelBuilder);

           
        }
    }
}
