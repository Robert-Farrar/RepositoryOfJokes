using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Joke
{
    public int Id { get; set; }

    public string? Setup { get; set; }

    public string? Punchline { get; set; }
}
