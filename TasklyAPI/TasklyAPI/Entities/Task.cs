using System;
using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.Entities
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; } // High, Medium, Low
        public string Status { get; set; } // ToDo, InProgress, Review, Done
        public DateTime DueDate { get; set; }
        public int ProjectId { get; set; }
        public int? AssignedUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 