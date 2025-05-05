using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TasklyAPI.Entities
{
    public class Team
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CreatedByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public virtual ICollection<TeamMember> TeamMembers { get; set; }
    }

    public class TeamMember
    {
        [Key]
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int UserId { get; set; }
        public string Role { get; set; } // Admin, Member
        public DateTime JoinedAt { get; set; }
    }
} 