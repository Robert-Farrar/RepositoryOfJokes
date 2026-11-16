using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Routes;

public static class JokeRoutes{

    //define extension method to allow access to app
    public static void MapJokeEndpoints(WebApplication app)
    {

        var JokeGroup = app.MapGroup("/Joke");

        //drop all api endpoints here
        //API GET needs: route, async (database context from models folder) followed by lambda expression
        JokeGroup.MapGet("/", async (AppDbContext db) =>
        {
            var jokes = await db.Jokes.ToListAsync();

            if(jokes == null)
            {
                return Results.NotFound(new {Message = $"Joke access failed"});
            }
            else{
                return Results.Ok(jokes);
            }
        }).RequireAuthorization(p => p.RequireClaim("role","user","admin"));

        JokeGroup.MapGet("/{Id:int}", async (int Id, AppDbContext db) =>
        {
            var joke = await db.Jokes.FindAsync(Id);
            
            if(joke == null)
            {
                 return Results.NotFound(new { Message = $"Joke with ID {Id} was not found." });
            }
            else
            {
                return Results.Ok(joke);
            }
        }).RequireAuthorization(p=> p.RequireClaim("role","user","admin"));

        JokeGroup.MapPost("/Add", async (Backend.Models.Joke joke, AppDbContext db) =>
        {
            if(joke != null){
            db.Jokes.Add(joke);
            await db.SaveChangesAsync();
            return Results.Created($"/Joke/{joke.Id}", joke);
            }
            else
            {
                return Results.Problem(
                    detail: "An error ocurred while saving item to database",
                    statusCode: 500
                );
            }
        }).RequireAuthorization(p => p.RequireClaim("role","admin"));

        JokeGroup.MapPost("/Rm", async (int Id, AppDbContext db) =>
        {
           var found = await db.Jokes.FindAsync(Id);

            if(found == null)
            {
                return Results.NotFound(new { Message = $"Item with ID {Id} was not found." });
            }
            
            db.Remove(Id);
            await db.SaveChangesAsync();
            return Results.NoContent();

        }).RequireAuthorization(p => p.RequireClaim("role","admin"));

        JokeGroup.MapGet("/Count", async (AppDbContext db) =>
        {
            var count = db.Jokes.CountAsync();
            return Results.Ok(new {TotalJokes = count});
        }).RequireAuthorization(p => p.RequireClaim("role","user", "admin"));

        JokeGroup.MapPut("/Update/{Id:int}", async (int Id, AppDbContext db, Backend.Models.Joke updatedJoke) =>
        {
            var existingJoke = await db.Jokes.FindAsync(Id);
            if(existingJoke is null)
            {
                return Results.NotFound("Joke with Id: {Id} was not found");
            }

            existingJoke.Setup = updatedJoke.Setup;
            existingJoke.Punchline = updatedJoke.Punchline;

            await db.SaveChangesAsync();

            return Results.Ok();

        }).RequireAuthorization(p => p.RequireClaim("role","admin"));
    }

    
}